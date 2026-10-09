// Group Manager
// Owns the per-level group hierarchy used by the level editor's hierarchy panel.
//
// Data model
// ----------
// Groups are stored in `levelData.groups` as a flat dictionary keyed by group id:
//   { [groupId]: { id, name, parentId: string|null, color?: string,
//                  hidden: boolean, collapsed: boolean, order: number } }
//
// Per-instance group membership lives on stateManager.instanceMeta:
//   { parentGroupId: string|null, labels: string[], name?: string, order?: number }
//
// Sibling ordering
// ----------------
// Every group and every instance-meta entry carries a numeric `order`. Smaller
// values sort earlier. When items are reordered via drag-drop in the hierarchy
// panel, we assign a new order value equal to the midpoint between the two
// neighbors (or neighbor ± 1 at the ends). This avoids rewriting order values
// on every sibling and gives us ~52 bits of fractional room before we'd need a
// rebalance pass. Items without an explicit order (legacy data) sort last,
// broken by the fallback "groups first alpha, then instances by uid".
//
// Selection model is unchanged: `selectionManager.selectedObjects` is still a
// Set<IInstance>. The hierarchy panel may select a group row, but that only
// translates to bulk-selecting the group's descendant instances in the viewport.

const GROUP_ID_PREFIX = "g_";

/**
 * Generate a stable, collision-resistant group id.
 * Uses crypto.randomUUID when available, falls back to time + random.
 */
function makeGroupId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return GROUP_ID_PREFIX + crypto.randomUUID();
  }
  return (
    GROUP_ID_PREFIX +
    Date.now().toString(36) +
    "_" +
    Math.random().toString(36).slice(2, 10)
  );
}

export class GroupManager {
  constructor() {
    // No internal cache: groups live on levelData and instance meta lives on
    // stateManager. We treat those as the source of truth so undo/redo works
    // automatically through the existing state diff/coalesce machinery.
  }

  destroy() {
    // Stateless; nothing to release.
  }

  // -------------------- Read helpers --------------------

  /**
   * Get the live groups dictionary from levelData.
   * Always returns an object (creates it lazily if missing on legacy levels).
   * @returns {Object<string, {id:string,name:string,parentId:string|null,color?:string,hidden:boolean,collapsed:boolean}>}
   */
  getGroups() {
    const settings = globalThis._editorScope?.levelSettings;
    if (!settings) return {};
    // Live reference — NOT getLevelData(), which deep-clones the whole level on
    // every call. getGroups() is called per instance in hot paths (selection,
    // descendant scans), so cloning here cost ~57µs/instance (a full-level JSON
    // round-trip) and dominated selection time. All mutation sites below use the
    // immutable pattern (`{ ...this.getGroups() }` then replace entries with new
    // objects, persisted via _commitGroups), so a live read reference is safe.
    const data = settings.getLevelDataRef();
    if (!data.groups || typeof data.groups !== "object") {
      data.groups = {};
    }
    return data.groups;
  }

  /** Get a single group by id, or null if it doesn't exist. */
  getGroup(groupId) {
    if (!groupId) return null;
    return this.getGroups()[groupId] ?? null;
  }

  /** Return the immediate child groups of a parent (null = root). */
  getChildGroups(parentId = null) {
    const groups = this.getGroups();
    return Object.values(groups).filter((g) => (g.parentId ?? null) === parentId);
  }

  /**
   * Walk up from a group to the root, returning [self, parent, ..., rootChild].
   * Stops at null parent or on a cycle (defensive).
   */
  getAncestorChain(groupId) {
    const chain = [];
    const seen = new Set();
    let current = this.getGroup(groupId);
    while (current && !seen.has(current.id)) {
      chain.push(current);
      seen.add(current.id);
      current = current.parentId ? this.getGroup(current.parentId) : null;
    }
    return chain;
  }

  /**
   * Return all descendant group ids of `groupId`, not including itself.
   */
  getDescendantGroupIds(groupId) {
    const groups = this.getGroups();
    const out = [];
    const stack = [groupId];
    while (stack.length) {
      const id = stack.pop();
      for (const g of Object.values(groups)) {
        if (g.parentId === id) {
          out.push(g.id);
          stack.push(g.id);
        }
      }
    }
    return out;
  }

  /**
   * Get the parentGroupId of an instance, or null if ungrouped or unknown.
   * Falls back to null when the referenced group has been deleted.
   */
  getInstanceParent(instance) {
    if (!instance) return null;
    const sm = globalThis._editorScope?.stateManager;
    if (!sm) return null;
    const meta = sm.getInstanceMeta(instance.uid);
    const parentId = meta.parentGroupId ?? null;
    if (parentId && !this.getGroup(parentId)) {
      // Stale reference: clean it up so subsequent reads are consistent.
      sm.setInstanceMeta(instance.uid, { parentGroupId: null });
      return null;
    }
    return parentId;
  }

  /**
   * Return all instances whose parentGroupId matches the given group, OR
   * any descendant of it. Pass null to enumerate root-level (ungrouped) instances.
   */
  getDescendantInstances(groupId) {
    const sm = globalThis._editorScope?.stateManager;
    if (!sm) return [];
    const all = sm.getAllInteractiveInstances();
    if (groupId === null) {
      return all.filter((inst) => this.getInstanceParent(inst) === null);
    }
    const matchSet = new Set([groupId, ...this.getDescendantGroupIds(groupId)]);
    return all.filter((inst) => {
      const parent = this.getInstanceParent(inst);
      return parent !== null && matchSet.has(parent);
    });
  }

  /**
   * Walk up from an instance through its group chain, returning the array of
   * ancestor group ids in order [parent, grandparent, ...]. Empty when the
   * instance is at the root.
   */
  getInstanceAncestorGroupIds(instance) {
    const parentId = this.getInstanceParent(instance);
    if (!parentId) return [];
    return this.getAncestorChain(parentId).map((g) => g.id);
  }

  /**
   * Compute the deepest common ancestor group id shared by every instance in
   * `instances`. Returns null if they share no group ancestor (i.e. the common
   * ancestor is the root).
   */
  getCommonAncestorGroupId(instances) {
    if (!instances || instances.length === 0) return null;
    let chain = this.getInstanceAncestorGroupIds(instances[0]);
    for (let i = 1; i < instances.length; i++) {
      const next = new Set(this.getInstanceAncestorGroupIds(instances[i]));
      chain = chain.filter((id) => next.has(id));
      if (chain.length === 0) return null;
    }
    // chain[0] is the deepest because getInstanceAncestorGroupIds returns
    // [parent, grandparent, ...] and intersection preserves order.
    return chain[0] ?? null;
  }

  /**
   * Compute the next order value for a new child under `parentId` (null = root).
   * Uses max(existing siblings' orders) + 1, falling back to the current number
   * of siblings when none have explicit orders. The returned value is only a
   * starting slot; drag-drop later assigns midpoints to insert between items.
   */
  _nextOrderForParent(parentId) {
    const normalizedParent = parentId ?? null;
    let maxOrder = -Infinity;

    // Check sibling groups.
    for (const g of Object.values(this.getGroups())) {
      if ((g.parentId ?? null) !== normalizedParent) continue;
      if (typeof g.order === "number" && g.order > maxOrder) maxOrder = g.order;
    }
    // Check sibling instances.
    const sm = globalThis._editorScope?.stateManager;
    if (sm) {
      const all = sm.getAllInteractiveInstances();
      for (const inst of all) {
        const meta = sm.getInstanceMeta(inst.uid);
        if ((meta.parentGroupId ?? null) !== normalizedParent) continue;
        if (typeof meta.order === "number" && meta.order > maxOrder)
          maxOrder = meta.order;
      }
    }

    if (maxOrder === -Infinity) return 0;
    // Step by 1 but leave room: we'll use midpoint insertion for reorder.
    return maxOrder + 1;
  }

  /**
   * Resolve an item's effective order for sorting, using the fallback scheme
   * (groups-first-alpha-then-uid) for anything without an explicit order.
   * The fallback is returned as a large positive number so explicit orders
   * (which are typically small) always sort first.
   *
   * Returns { order: number, fallbackKey: string } where fallbackKey is used
   * as a stable tiebreaker across items with equal `order`.
   */
  _sortKeyForItem(item) {
    // item = { kind: 'group'|'instance', ref: group|instance }
    if (item.kind === "group") {
      const g = item.ref;
      const order = typeof g.order === "number" ? g.order : Number.POSITIVE_INFINITY;
      // Groups sort before instances when both fall into the fallback bucket.
      return { order, fallbackKey: `0:${(g.name || "").toLowerCase()}:${g.id}` };
    }
    const inst = item.ref;
    const sm = globalThis._editorScope?.stateManager;
    const meta = sm ? sm.getInstanceMeta(inst.uid) : { order: null };
    const order =
      typeof meta.order === "number" ? meta.order : Number.POSITIVE_INFINITY;
    return { order, fallbackKey: `1:${String(inst.uid).padStart(10, "0")}` };
  }

  /**
   * List all direct children of `parentId` (null = root) sorted by `order`.
   * Mixed array of { kind: 'group'|'instance', ref }.
   */
  getSortedChildren(parentId = null) {
    const normalizedParent = parentId ?? null;
    const items = [];

    for (const g of Object.values(this.getGroups())) {
      if ((g.parentId ?? null) === normalizedParent) {
        items.push({ kind: "group", ref: g });
      }
    }
    const sm = globalThis._editorScope?.stateManager;
    if (sm) {
      const all = sm.getAllInteractiveInstances();
      for (const inst of all) {
        const meta = sm.getInstanceMeta(inst.uid);
        if ((meta.parentGroupId ?? null) === normalizedParent) {
          items.push({ kind: "instance", ref: inst });
        }
      }
    }

    items.sort((a, b) => {
      const ka = this._sortKeyForItem(a);
      const kb = this._sortKeyForItem(b);
      if (ka.order !== kb.order) return ka.order - kb.order;
      return ka.fallbackKey < kb.fallbackKey ? -1 : ka.fallbackKey > kb.fallbackKey ? 1 : 0;
    });
    return items;
  }

  /**
   * Assign a new `order` value to a target so it sits between `beforeId` and
   * `afterId` (either may be null to indicate "at the start" / "at the end").
   * Target is specified as { kind, id } where id is a group id or an instance
   * uid. Pass the target's new parent as `newParentId` (may equal the current
   * parent if this is a pure reorder).
   *
   * Uses a midpoint strategy: new order = (beforeOrder + afterOrder) / 2.
   * When inserting at either end, uses neighbor ± 1. Reparenting is applied
   * in the same call so the drag-drop flow is atomic from an undo perspective.
   */
  reorderChild({ kind, id }, newParentId, beforeId, afterId) {
    const normalizedParent = newParentId ?? null;
    const sm = globalThis._editorScope?.stateManager;

    // Resolve neighbor orders. A null id means "no neighbor on that side".
    const resolveOrder = (neighborId) => {
      if (!neighborId) return null;
      // Look up as group first, then as instance uid.
      const g = this.getGroup(neighborId);
      if (g && typeof g.order === "number") return g.order;
      if (sm) {
        const numericUid = typeof neighborId === "number" ? neighborId : Number(neighborId);
        if (!Number.isNaN(numericUid)) {
          const meta = sm.getInstanceMeta(numericUid);
          if (typeof meta.order === "number") return meta.order;
        }
      }
      return null;
    };

    const beforeOrder = resolveOrder(beforeId);
    const afterOrder = resolveOrder(afterId);

    let newOrder;
    if (beforeOrder !== null && afterOrder !== null) {
      newOrder = (beforeOrder + afterOrder) / 2;
      // Guard against collapsing to a neighbor due to float precision.
      if (newOrder === beforeOrder || newOrder === afterOrder) {
        // Nudge past afterOrder; callers can periodically rebalance if needed.
        newOrder = afterOrder + 1;
      }
    } else if (beforeOrder !== null) {
      newOrder = beforeOrder + 1;
    } else if (afterOrder !== null) {
      newOrder = afterOrder - 1;
    } else {
      newOrder = 0;
    }

    if (kind === "group") {
      const groups = { ...this.getGroups() };
      const g = groups[id];
      if (!g) return false;
      // Reparent safety (cycle check) when parent actually changes.
      if ((g.parentId ?? null) !== normalizedParent) {
        if (normalizedParent !== null && !groups[normalizedParent]) return false;
        if (normalizedParent !== null) {
          let cursor = normalizedParent;
          const seen = new Set();
          while (cursor && !seen.has(cursor)) {
            if (cursor === id) return false;
            seen.add(cursor);
            cursor = groups[cursor]?.parentId ?? null;
          }
        }
      }
      groups[id] = { ...g, parentId: normalizedParent, order: newOrder };
      this._commitGroups(groups, "Reorder Group");
      return true;
    }

    if (kind === "instance") {
      if (!sm) return false;
      const numericUid = typeof id === "number" ? id : Number(id);
      if (Number.isNaN(numericUid)) return false;
      if (normalizedParent !== null && !this.getGroup(normalizedParent)) return false;
      sm.setInstanceMeta(numericUid, {
        parentGroupId: normalizedParent,
        order: newOrder,
      });
      // Reparent + reorder of an instance is metadata-only; we still want it
      // on the undo stack so the panel's drag-drop is reversible.
      sm.pushUndoState("Reorder Instance");
      return true;
    }

    return false;
  }

  // -------------------- Mutations --------------------

  /**
   * Persist the current groups dictionary back through levelSettings so that
   * the change is picked up by the undo/redo diff system. Pass a description
   * for the undo entry.
   *
   * Uses updateLevelData('groups', ...) which both sets the value and pushes
   * an undo state.
   */
  _commitGroups(groups, description) {
    const settings = globalThis._editorScope?.levelSettings;
    if (!settings) return;
    // Replace with a fresh object reference so the diff system sees a change
    // even when the caller mutated in place.
    settings.updateLevelData("groups", { ...groups });
    if (description && globalThis._editorScope?.stateManager) {
      // updateLevelData already pushes a generic "Change groups" entry; we
      // override the description by pushing a more meaningful one immediately
      // after. The coalesce window will merge them into a single entry.
      globalThis._editorScope.stateManager.pushUndoState(description);
    }
    // Let the hierarchy panel re-render. Safe to call even when the panel
    // isn't initialized — refreshHierarchyPanel no-ops in that case.
    const panel = globalThis._editorScope?.hierarchyPanel;
    if (panel) panel.refresh();
  }

  /**
   * Generate a human-friendly default name for a new group.
   */
  _nextDefaultName(groups) {
    const used = new Set(Object.values(groups).map((g) => g.name));
    let i = 1;
    while (used.has(`Group ${i}`)) i++;
    return `Group ${i}`;
  }

  /**
   * Create a new group. Returns the created group object, or null on failure.
   * @param {Object} opts
   * @param {string} [opts.name] - Display name; auto-generated if omitted.
   * @param {string|null} [opts.parentId=null] - Parent group id, or null for root.
   * @param {string} [opts.color] - Optional accent color (hex).
   * @param {string} [opts.iconName] - Optional icon name (key into iconList).
   *                                   Set when the group originates from a
   *                                   preset placement (auto-grouped struct).
   * @param {string[]} [opts.memberInstances] - Instances to immediately reparent into the new group.
   * @param {string} [opts.description] - Undo entry description.
   */
  createGroup({
    name,
    parentId = null,
    color,
    iconName,
    memberInstances = [],
    description = "Create Group",
  } = {}) {
    const groups = { ...this.getGroups() };
    if (parentId && !groups[parentId]) {
      console.warn(`[GroupManager] createGroup: unknown parentId ${parentId}`);
      parentId = null;
    }
    const id = makeGroupId();
    const group = {
      id,
      name: name || this._nextDefaultName(groups),
      parentId: parentId ?? null,
      hidden: false,
      collapsed: false,
      // Append at the end of the parent's current child list.
      order: this._nextOrderForParent(parentId ?? null),
    };
    if (color) group.color = color;
    if (iconName) group.iconName = iconName;
    groups[id] = group;

    // Reparent any specified instances into this new group. Assign incremental
    // orders so they preserve their incoming sequence inside the new group.
    const sm = globalThis._editorScope?.stateManager;
    if (sm && memberInstances.length > 0) {
      let baseOrder = 0;
      for (let i = 0; i < memberInstances.length; i++) {
        const inst = memberInstances[i];
        if (!inst) continue;
        sm.setInstanceMeta(inst.uid, {
          parentGroupId: id,
          order: baseOrder + i,
        });
      }
    }

    this._commitGroups(groups, description);
    return group;
  }

  /** Rename a group. */
  renameGroup(groupId, newName) {
    const groups = { ...this.getGroups() };
    const g = groups[groupId];
    if (!g) return false;
    if (g.name === newName) return true;
    groups[groupId] = { ...g, name: newName };
    this._commitGroups(groups, `Rename Group "${newName}"`);
    return true;
  }

  /** Set a group's color. Pass null/undefined to clear. */
  setGroupColor(groupId, color) {
    const groups = { ...this.getGroups() };
    const g = groups[groupId];
    if (!g) return false;
    const next = { ...g };
    if (color) next.color = color;
    else delete next.color;
    groups[groupId] = next;
    this._commitGroups(groups, "Change Group Color");
    return true;
  }

  /** Toggle (or set) a group's hidden flag. Hidden groups filter their descendants from picks. */
  setGroupHidden(groupId, hidden) {
    const groups = { ...this.getGroups() };
    const g = groups[groupId];
    if (!g) return false;
    const value = !!hidden;
    if (g.hidden === value) return true;
    groups[groupId] = { ...g, hidden: value };
    this._commitGroups(groups, value ? "Hide Group" : "Show Group");
    return true;
  }

  /** Toggle (or set) a group's collapsed flag in the hierarchy panel. */
  setGroupCollapsed(groupId, collapsed) {
    const groups = { ...this.getGroups() };
    const g = groups[groupId];
    if (!g) return false;
    const value = !!collapsed;
    if (g.collapsed === value) return true;
    groups[groupId] = { ...g, collapsed: value };
    // Collapse state is UI-only; persist but don't bother with a descriptive
    // undo entry — it'd be noise. We still go through updateLevelData so it
    // round-trips on save/load.
    this._commitGroups(groups, null);
    return true;
  }

  /**
   * Reparent a group. Rejects cycles (cannot move a group under one of its own
   * descendants) and unknown parents.
   */
  reparentGroup(groupId, newParentId) {
    if (groupId === newParentId) return false;
    const groups = { ...this.getGroups() };
    const g = groups[groupId];
    if (!g) return false;
    if (newParentId !== null && !groups[newParentId]) return false;
    if (newParentId !== null) {
      // Walk up from newParent; if we encounter groupId, it would form a cycle.
      let cursor = newParentId;
      const seen = new Set();
      while (cursor && !seen.has(cursor)) {
        if (cursor === groupId) return false;
        seen.add(cursor);
        cursor = groups[cursor]?.parentId ?? null;
      }
    }
    if ((g.parentId ?? null) === (newParentId ?? null)) return true;
    // Place the moved group at the end of its new parent's child list. Drag-
    // drop reorders can subsequently refine via reorderChild().
    const newOrder = this._nextOrderForParent(newParentId ?? null);
    groups[groupId] = { ...g, parentId: newParentId ?? null, order: newOrder };
    this._commitGroups(groups, "Reparent Group");
    return true;
  }

  /**
   * Reparent an instance into a group (or to root with null).
   * Does not create undo on its own; bundle through the caller's flow.
   */
  setInstanceParent(instance, parentGroupId) {
    if (!instance) return false;
    const sm = globalThis._editorScope?.stateManager;
    if (!sm) return false;
    if (parentGroupId && !this.getGroup(parentGroupId)) return false;
    // Append at end of new parent's child list.
    const newOrder = this._nextOrderForParent(parentGroupId ?? null);
    sm.setInstanceMeta(instance.uid, {
      parentGroupId: parentGroupId ?? null,
      order: newOrder,
    });
    return true;
  }

  /**
   * Delete a group recursively: every descendant group is removed, and every
   * descendant instance is destroyed. Selection is updated accordingly.
   * @param {string} groupId
   * @param {Object} [opts]
   * @param {string} [opts.description] - Undo entry description.
   * @returns {{ groupsDeleted:number, instancesDeleted:number }}
   */
  deleteGroupRecursive(groupId, { description = "Delete Group" } = {}) {
    const result = { groupsDeleted: 0, instancesDeleted: 0 };
    const groups = { ...this.getGroups() };
    const root = groups[groupId];
    if (!root) return result;

    const idsToDelete = new Set([groupId, ...this.getDescendantGroupIds(groupId)]);

    // IMPORTANT: push an undo snapshot BEFORE we mutate the world. Because
    // stateManager.pushUndoState serializes the current live scene, doing this
    // after destroys would capture the post-delete state (i.e. undo would
    // restore nothing). This ordering means Undo after a group-delete fully
    // restores both the destroyed instances and the removed group entries.
    const sm = globalThis._editorScope?.stateManager;
    if (sm && typeof sm.pushUndoState === "function") {
      try {
        sm.pushUndoState(description);
      } catch (err) {
        console.warn("[GroupManager] pushUndoState failed:", err);
      }
    }

    // Destroy all descendant instances. We've already captured the pre-delete
    // snapshot above, so further _commitGroups calls below must NOT push
    // another undo entry (pass description=null).
    const sel = globalThis._editorScope?.selectionManager;
    if (sm) {
      const all = sm.getAllInteractiveInstances();
      for (const inst of all) {
        const meta = sm.getInstanceMeta(inst.uid);
        if (meta.parentGroupId && idsToDelete.has(meta.parentGroupId)) {
          // Use selectionManager.destroyInstance when available so selection
          // and editor metadata stay in sync.
          if (sel && typeof sel.destroyInstance === "function") {
            sel.destroyInstance(inst);
          } else {
            sm.clearInstanceMeta(inst.uid);
            try {
              inst.destroy();
            } catch (err) {
              console.warn(
                `[GroupManager] failed to destroy instance ${inst.uid}:`,
                err
              );
            }
          }
          result.instancesDeleted++;
        }
      }
    }

    // Remove the groups themselves.
    for (const id of idsToDelete) {
      delete groups[id];
      result.groupsDeleted++;
    }
    // Pass null so _commitGroups skips its own pushUndoState — we already did it.
    this._commitGroups(groups, null);
    return result;
  }

  /**
   * Dissolve a group: reparent its direct children (groups and instances) to
   * its own parent, then remove the group itself. No data is destroyed.
   */
  dissolveGroup(groupId, { description } = {}) {
    const groups = { ...this.getGroups() };
    const g = groups[groupId];
    if (!g) return false;
    const newParent = g.parentId ?? null;

    // Adopted children take over the dissolved group's slot by ordering them
    // as small fractional offsets from the dissolved group's own `order`.
    // Example: group.order = 3 -> children become 3.0001, 3.0002, ...
    // This preserves relative position in the parent without rewriting every
    // sibling's order. Collisions past the next integer are unlikely in
    // practice; rebalancing can be added later if needed.
    const baseOrder = typeof g.order === "number" ? g.order : 0;
    const STEP = 0.0001;

    // Collect the children we're about to adopt, sorted by their current order
    // inside the dissolving group so they keep relative sequence.
    const childrenToAdopt = this.getSortedChildren(groupId);

    let slot = 0;
    // Reparent child groups.
    for (const child of childrenToAdopt) {
      if (child.kind !== "group") continue;
      const cg = groups[child.ref.id];
      if (!cg) continue;
      groups[cg.id] = {
        ...cg,
        parentId: newParent,
        order: baseOrder + slot * STEP,
      };
      slot++;
    }

    // Reparent child instances.
    const sm = globalThis._editorScope?.stateManager;
    if (sm) {
      for (const child of childrenToAdopt) {
        if (child.kind !== "instance") continue;
        sm.setInstanceMeta(child.ref.uid, {
          parentGroupId: newParent,
          order: baseOrder + slot * STEP,
        });
        slot++;
      }
    }

    delete groups[groupId];
    this._commitGroups(groups, description || `Ungroup "${g.name}"`);
    return true;
  }

  // -------------------- Hotkey-driven operations --------------------

  /**
   * Ctrl+G: group the current viewport selection.
   *
   * Behavior:
   *  - No-op when selection is empty.
   *  - New group's parent is the deepest common ancestor group of the selected
   *    instances; if there is none, the new group is created at the root.
   *  - All selected instances are reparented into the new group.
   * Returns the new group, or null on no-op.
   */
  groupSelected() {
    const sel = globalThis._editorScope?.selectionManager;
    if (!sel || !sel.hasSelection()) return null;
    const instances = sel.getSelection();
    const parentId = this.getCommonAncestorGroupId(instances);

    // Preserve inner groups:
    //
    // If the selection fully covers a sub-group (i.e. every descendant instance
    // of that sub-group is in the selection AND the sub-group sits strictly
    // below the chosen `parentId`), we want the new group to own the sub-group
    // itself — not have it flattened into a sea of loose instances.
    //
    // Algorithm:
    //   1. For every group G whose ancestor chain includes `parentId` (or every
    //      root group when parentId is null), check whether
    //         getDescendantInstances(G) ⊆ selectionSet.
    //      Those are the "fully-covered" candidates.
    //   2. Pick the MAXIMAL covered groups — drop any G whose own ancestor
    //      chain already contains another covered group (we only reparent the
    //      topmost covered subtree; its descendants come along for free).
    //   3. Reparent the maximal covered groups into the new group.
    //   4. Reparent only those selected instances NOT already inside a
    //      maximal-covered subtree — those instances move in "loose".
    const selectionSet = new Set(instances);
    const groupsMap = this.getGroups();

    // Candidate groups: those whose parent chain contains `parentId` (or all
    // groups when parentId is null and we're grouping at the root).
    const candidateIds = [];
    for (const g of Object.values(groupsMap)) {
      if (parentId === null) {
        candidateIds.push(g.id);
      } else {
        const chain = this.getAncestorChain(g.parentId).map((x) => x.id);
        // g itself must be a strict descendant of parentId (parentId
        // is not candidate-able because it *is* the common ancestor).
        if (g.id !== parentId && (g.parentId === parentId || chain.includes(parentId))) {
          candidateIds.push(g.id);
        }
      }
    }

    // Fully-covered test: every descendant instance of G is in selectionSet,
    // and G has at least one descendant instance (empty groups can't be
    // "covered" by a selection).
    const coveredIds = new Set();
    for (const gid of candidateIds) {
      const desc = this.getDescendantInstances(gid);
      if (desc.length === 0) continue;
      let covered = true;
      for (const d of desc) {
        if (!selectionSet.has(d)) {
          covered = false;
          break;
        }
      }
      if (covered) coveredIds.add(gid);
    }

    // Keep only maximal covered groups (drop any whose ancestor is also covered).
    const maximalCovered = new Set();
    for (const gid of coveredIds) {
      const ancestors = this.getAncestorChain(groupsMap[gid]?.parentId ?? null).map(
        (x) => x.id
      );
      const hasCoveredAncestor = ancestors.some((aid) => coveredIds.has(aid));
      if (!hasCoveredAncestor) maximalCovered.add(gid);
    }

    // Instances that live inside any maximalCovered subtree are "already
    // carried" — don't reparent them directly; the subtree move brings them.
    const descendantGroupIdsOfCovered = new Set();
    for (const gid of maximalCovered) {
      descendantGroupIdsOfCovered.add(gid);
      for (const did of this.getDescendantGroupIds(gid)) {
        descendantGroupIdsOfCovered.add(did);
      }
    }
    const looseInstances = instances.filter((inst) => {
      const p = this.getInstanceParent(inst);
      return !(p && descendantGroupIdsOfCovered.has(p));
    });

    // Create the new group with only the loose instances.
    const newGroup = this.createGroup({
      parentId,
      memberInstances: looseInstances,
      description: "Group Selection",
    });
    if (!newGroup) return null;

    // Reparent each maximal-covered subtree's ROOT group under the new group.
    // We re-read groups after createGroup so we see the freshly committed map.
    if (maximalCovered.size > 0) {
      const groupsNext = { ...this.getGroups() };
      let orderSlot =
        Object.values(groupsNext)
          .filter((g) => g.parentId === newGroup.id)
          .reduce((m, g) => Math.max(m, g.order ?? 0), -1) + 1;
      for (const gid of maximalCovered) {
        const g = groupsNext[gid];
        if (!g) continue;
        groupsNext[gid] = { ...g, parentId: newGroup.id, order: orderSlot++ };
      }
      // Fold into the same undo entry — pass null so _commitGroups doesn't
      // push a second snapshot on top of "Group Selection".
      this._commitGroups(groupsNext, null);
    }
    return newGroup;
  }

  /**
   * Ctrl+Shift+G: dissolve the parent group shared by every selected instance.
   *
   * Behavior:
   *  - No-op when selection is empty or instances don't share a single parent group.
   *  - The shared parent group is dissolved: its children (instances + child groups)
   *    are reparented to the grandparent, then the group itself is removed.
   * Returns the dissolved group's id on success, or null on no-op.
   */
  ungroupSelected() {
    const target = this._findGroupExactlyMatchingSelection();
    if (!target) return null;
    this.dissolveGroup(target, { description: "Ungroup Selection" });
    return target;
  }

  /**
   * Predicate used by the toolbar to pick between Group and Ungroup for the
   * combined group-toggle button.
   *
   * Returns true iff there exists a group G whose set of descendant instances
   * is EXACTLY the current selection set. That covers both the simple case
   * (all selected instances share one direct parent group with nothing else
   * inside) AND the nested case (the user selected a parent group from the
   * hierarchy panel, which expands to all leaf instances under any number of
   * subgroups).
   *
   * Returns false for empty selections, partial-coverage selections, or
   * selections that span sibling/cousin groups without a shared full parent.
   */
  isSelectionUngroupable() {
    return this._findGroupExactlyMatchingSelection() !== null;
  }

  /**
   * Internal: scan all groups and return the deepest one whose descendant
   * instances exactly match the current viewport selection. Returns null if
   * no such group exists. Used by both ungroupSelected() and
   * isSelectionUngroupable().
   *
   * "Deepest" means: when nested groups all happen to match (which can only
   * happen if every level has exactly the same descendants — i.e. each
   * intermediate group has only one child group), we ungroup the innermost
   * one. This keeps Ctrl+Shift+G predictable: it always peels exactly one
   * layer.
   */
  _findGroupExactlyMatchingSelection() {
    const sel = globalThis._editorScope?.selectionManager;
    if (!sel || !sel.hasSelection()) return null;
    const instances = sel.getSelection();
    const selectionSet = new Set(instances);
    const selectionSize = selectionSet.size;

    // The deepest group containing the entire selection is the selection's
    // common-ancestor group: every shallower group has strictly more
    // descendants, and no deeper group contains the whole selection. So the
    // ONLY group that can be an exact match is that common ancestor — test just
    // it, instead of calling getDescendantInstances() for every group in the
    // level (which was O(groups × allInstances) and dominated toolbar updates).
    const candidateId = this.getCommonAncestorGroupId(instances);
    if (candidateId === null) return null;

    const desc = this.getDescendantInstances(candidateId);
    if (desc.length !== selectionSize) return null;
    for (const d of desc) {
      if (!selectionSet.has(d)) return null;
    }
    return candidateId;
  }

  /**
   * Remove every group that has zero descendant instances AND zero child
   * groups. Repeats until stable so chains of empty parents collapse in one
   * shot (e.g. deleting the lone instance inside A/B/C nukes A, B, AND C).
   *
   * Caller is responsible for committing the returned groups map (via
   * levelSettings.updateLevelData) and pushing an undo entry; this method
   * intentionally does NOT push undo so it can be folded into a parent
   * operation's single undo snapshot (e.g. Delete Objects).
   *
   * Returns the number of groups pruned.
   */
  pruneEmptyGroups() {
    const sm = globalThis._editorScope?.stateManager;
    const settings = globalThis._editorScope?.levelSettings;
    if (!settings) return 0;
    const groups = { ...this.getGroups() };
    let prunedTotal = 0;

    // Build a parent->children-count map up-front so we don't recompute on
    // every iteration. We also need a quick "does any instance belong to this
    // group?" check; iterate all instances once and tally.
    const instancesByParent = new Map(); // parentGroupId -> count
    if (sm) {
      const all = sm.getAllInteractiveInstances();
      for (const inst of all) {
        const meta = sm.getInstanceMeta(inst.uid);
        const p = meta.parentGroupId;
        if (!p) continue;
        instancesByParent.set(p, (instancesByParent.get(p) ?? 0) + 1);
      }
    }
    const childGroupsByParent = new Map(); // parentGroupId -> count
    for (const g of Object.values(groups)) {
      if (!g.parentId) continue;
      childGroupsByParent.set(
        g.parentId,
        (childGroupsByParent.get(g.parentId) ?? 0) + 1
      );
    }

    // Iteratively prune. A group is "empty" when it has no instance children
    // and no group children. Each prune may empty its parent, so loop until
    // stable. This is O(N * depth) worst case which is fine for editor scale.
    let changed = true;
    while (changed) {
      changed = false;
      for (const id of Object.keys(groups)) {
        const hasInstances = (instancesByParent.get(id) ?? 0) > 0;
        const hasChildGroups = (childGroupsByParent.get(id) ?? 0) > 0;
        if (!hasInstances && !hasChildGroups) {
          const g = groups[id];
          // Decrement our parent's child-group counter so we may emancipate
          // an ancestor in the next pass.
          if (g.parentId) {
            const c = (childGroupsByParent.get(g.parentId) ?? 1) - 1;
            if (c <= 0) childGroupsByParent.delete(g.parentId);
            else childGroupsByParent.set(g.parentId, c);
          }
          delete groups[id];
          prunedTotal++;
          changed = true;
        }
      }
    }

    if (prunedTotal === 0) return 0;
    // Commit silently — caller's undo entry will capture this state.
    settings.updateLevelData("groups", { ...groups });
    return prunedTotal;
  }
}

// -------------------- Module-level singleton --------------------

let groupManagerInstance = null;

export function initializeGroupManager() {
  if (groupManagerInstance) return groupManagerInstance;
  groupManagerInstance = new GroupManager();
  globalThis._editorScope = globalThis._editorScope || {};
  globalThis._editorScope.groupManager = groupManagerInstance;
  return groupManagerInstance;
}

export function getGroupManager() {
  return groupManagerInstance;
}

export function destroyGroupManager() {
  if (groupManagerInstance) {
    groupManagerInstance.destroy();
    groupManagerInstance = null;
  }
}
