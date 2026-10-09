// Impl: Gimbal (orbital rings)
// -----------------------------
// Visually distinct alternative to the triad: a translucent disk with
// three orbital rings — one per coordinate plane (XY / XZ / YZ) — drawn
// in the corresponding axis colour. Small axis-letter caps sit on the
// rim at each ring's local +/- axis. The whole assembly rotates with the
// camera so the rings always show the world's orientation.
//
// Rendering: SVG. Each ring is a circle projected to an ellipse (the
// camera-relative basis defines the ring's two in-plane axes; their X/Y
// screen components become the ellipse's two radii vectors, drawn as a
// quadratic-Bezier-approximated path).
//
// Hit testing: the axis caps are real <circle> elements with
// pointer-events. Click → setView. The disk itself is a no-op visually
// but reserves pointer area for drag-orbit (handled by the wrapper).

import { Theme } from "../../inspectorUI.js";
import { AXIS_DEFS, projectAxis, getCameraBasis, hashBasis } from "../gizmoUtils.js";
import { attachDragOrbit } from "../dragOrbit.js";

const SIZE = 96;
const CENTER = SIZE / 2;
const DISK_R = 44;       // outer translucent disk
const RING_R = 38;       // orbital ring radius
const CAP_R = 9;         // axis cap circle
const CAP_R_HOVER = 11;
const SVG_NS = "http://www.w3.org/2000/svg";

function axisColor(c) {
  if (c === "x") return Theme.axisX;
  if (c === "y") return Theme.axisY;
  return Theme.axisZ;
}

// The three coordinate planes, each defined by the two world-axis indices
// it spans. The ring's stroke colour matches the plane's NORMAL axis,
// which is the axis perpendicular to the ring (so the XY ring is Z-blue,
// matching how a Z-axis rotation would spin objects through that plane).
const RINGS = [
  { id: "xy", a: 0, b: 1, normalChar: "z" },
  { id: "xz", a: 0, b: 2, normalChar: "y" },
  { id: "yz", a: 1, b: 2, normalChar: "x" },
];

export class GimbalGizmo {
  constructor(host) {
    this.host = host;
    this.cc = null;
    this.runtime = null;
    this.boundTick = null;
    this._lastBasisHash = "";
    this._lastHoverHash = "";
    this._hoverKey = null;
    this._build();
  }

  _build() {
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("width", SIZE);
    svg.setAttribute("height", SIZE);
    svg.setAttribute("viewBox", `0 0 ${SIZE} ${SIZE}`);
    svg.style.display = "block";
    svg.style.overflow = "visible";
    svg.style.pointerEvents = "auto";
    this.svg = svg;

    // Background disk: translucent fill so the gizmo reads as a solid
    // object you're looking at, and gives drag-orbit a generous hit area.
    this.disk = document.createElementNS(SVG_NS, "circle");
    this.disk.setAttribute("cx", CENTER);
    this.disk.setAttribute("cy", CENTER);
    this.disk.setAttribute("r", DISK_R);
    this.disk.setAttribute("fill", Theme.componentBackground);
    this.disk.setAttribute("fill-opacity", "0.55");
    this.disk.setAttribute("stroke", Theme.borderSecondary);
    this.disk.setAttribute("stroke-width", "1");
    svg.appendChild(this.disk);

    // One <path> per ring; we update the `d` attribute every frame.
    this.ringPaths = {};
    for (const r of RINGS) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke", axisColor(r.normalChar));
      path.setAttribute("stroke-width", "1.6");
      path.setAttribute("stroke-linecap", "round");
      path.style.pointerEvents = "none";
      svg.appendChild(path);
      this.ringPaths[r.id] = path;
    }

    // Axis caps: 6 little circles labelled X/Y/Z (positive solid,
    // negative ring-only). Real DOM hover is fine here — they're
    // far-apart enough that there's no jitter.
    this.caps = AXIS_DEFS.map((def) => {
      const color = axisColor(def.axisChar);
      const g = document.createElementNS(SVG_NS, "g");
      g.style.cursor = "pointer";
      // Explicit pointer-events so the cap (and only the cap, not its
      // children which we mark `none` below) is the click target.
      g.style.pointerEvents = "auto";
      const circle = document.createElementNS(SVG_NS, "circle");
      circle.setAttribute("r", CAP_R);
      circle.setAttribute("stroke", color);
      circle.setAttribute("stroke-width", "1.5");
      circle.setAttribute("fill", def.positive ? color : Theme.componentBackground);
      // Children inherit pointer-events from <g> by default; explicit
      // `auto` here is belt-and-braces so the underlying circle is
      // definitely a hit target even if some browser quirk demotes the
      // group to non-hit.
      circle.style.pointerEvents = "auto";
      g.appendChild(circle);

      // Letter on positive caps only — keeps negative caps cleaner.
      const text = document.createElementNS(SVG_NS, "text");
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "central");
      text.setAttribute("font-family", "'Segoe UI', Tahoma, sans-serif");
      text.setAttribute("font-size", "10");
      text.setAttribute("font-weight", "700");
      text.setAttribute("fill", def.positive ? "#fff" : color);
      text.style.pointerEvents = "none";
      text.style.userSelect = "none";
      text.textContent = def.label.replace(/[+-]/, "");
      g.appendChild(text);

      g.addEventListener("mouseenter", () => { this._hoverKey = def.key; this._render(undefined, false); });
      g.addEventListener("mouseleave", () => { this._hoverKey = null;    this._render(undefined, false); });
      g.addEventListener("click", (e) => {
        e.stopPropagation();
        if (this.cc) this.cc.setView(def.key, { animate: true });
      });

      this.svg.appendChild(g);
      return { def, group: g, circle, text, color, depth: 0, x: 0, y: 0 };
    });

    this.host.appendChild(svg);
  }

  attach(cc, runtime) {
    this.cc = cc;
    this.runtime = runtime;
    this.boundTick = () => this._tick();
    runtime.addEventListener("tick", this.boundTick);
    this._detachDrag = attachDragOrbit(this.svg, () => this.cc);
    this._render();
  }

  _tick() {
    if (!this.cc) return;
    const basis = getCameraBasis(this.cc);
    if (!basis) return;
    const basisHash = hashBasis(basis);
    const hoverHash = this._hoverKey || "";
    if (basisHash === this._lastBasisHash && hoverHash === this._lastHoverHash) return;
    const basisChanged = basisHash !== this._lastBasisHash;
    this._lastBasisHash = basisHash;
    this._lastHoverHash = hoverHash;
    this._render(basis, basisChanged);
  }

  // Build an elliptical orbit ring path for a coordinate plane defined
  // by world axes `a` and `b`. The ring's two parametric axes in screen
  // space are p_a = projectAxis(unitA) and p_b = projectAxis(unitB),
  // giving a 2D parametric ellipse:
  //   p(t) = center + p_a * cos(t) + p_b * sin(t)
  // We sample it at N segments and join with a polyline path. N=48 is
  // well below visible faceting at this size.
  _ringPath(basis, ringDef) {
    const ua = [0, 0, 0]; ua[ringDef.a] = 1;
    const ub = [0, 0, 0]; ub[ringDef.b] = 1;
    const pa = projectAxis(ua, basis, RING_R);
    const pb = projectAxis(ub, basis, RING_R);
    const N = 48;
    let d = "";
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * Math.PI * 2;
      const c = Math.cos(t);
      const s = Math.sin(t);
      const x = CENTER + pa.sx * c + pb.sx * s;
      const y = CENTER + pa.sy * c + pb.sy * s;
      d += (i === 0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2) + " ";
    }
    // Edge-on factor: how perpendicular the ring's normal is to the
    // viewing direction. When the ring is edge-on, both pa and pb live
    // close to the same screen line, so the cross-product magnitude
    // (== ellipse area / pi) is small. Use this to fade edge-on rings.
    const cross = Math.abs(pa.sx * pb.sy - pa.sy * pb.sx);
    const maxCross = RING_R * RING_R;
    const opacity = 0.35 + 0.55 * Math.min(1, cross / maxCross);
    return { d, opacity };
  }

  _render(basisIn, reorderCaps = true) {
    const basis = basisIn || (this.cc ? getCameraBasis(this.cc) : null);
    if (!basis) return;

    // Update the three orbit rings.
    for (const r of RINGS) {
      const { d, opacity } = this._ringPath(basis, r);
      const path = this.ringPaths[r.id];
      path.setAttribute("d", d);
      path.setAttribute("stroke-opacity", opacity.toFixed(3));
    }

    // Compute new screen positions + depth for each cap.
    for (const cap of this.caps) {
      const p = projectAxis(cap.def.vec, basis, RING_R);
      cap.x = CENTER + p.sx;
      cap.y = CENTER + p.sy;
      cap.depth = p.depth;
    }
    // When an axis points roughly toward the camera, both its + and -
    // caps project to nearly the same screen point (the gizmo center
    // for a perfect on-axis view). Stacked caps would mean only the
    // front one is clickable. Resolution: HIDE the front cap entirely
    // and let the back cap occupy the shared screen position alone.
    // Clicking the (now sole) cap snaps to the opposite axis — i.e.
    // it acts as a "flip view" button, which matches what the user
    // expects when they're already looking down that axis.
    //
    // Pairs: indices into AXIS_DEFS — (+x,-x), (+y,-y), (+z,-z).
    for (const cap of this.caps) cap.hidden = false;
    for (let i = 0; i < this.caps.length; i += 2) {
      const a = this.caps[i];
      const b = this.caps[i + 1];
      if (!b) continue;
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const d2 = dx * dx + dy * dy;
      // Threshold: if the two caps are within ~one cap diameter, they
      // visually overlap. Hide the FRONT cap so the back one is the
      // sole hit-target at this screen position.
      if (d2 < (CAP_R * 2) * (CAP_R * 2)) {
        const front = a.depth < b.depth ? a : b;
        front.hidden = true;
      }
    }
    // Re-sort + re-append only when the basis actually changed. Doing
    // this on hover-only ticks would detach/re-attach the <g> the user
    // is hovering, which cancels the in-flight pointerdown→click
    // sequence and breaks axis clicks. Hover-only ticks just restyle.
    //
    // Sort a copy so this.caps stays in AXIS_DEFS order; the pair
    // detection above relies on +x/-x being adjacent (i, i+1).
    if (reorderCaps) {
      const sorted = this.caps.slice().sort((a, b) => b.depth - a.depth);
      for (const cap of sorted) this.svg.appendChild(cap.group);
    }

    for (const cap of this.caps) {
      if (cap.hidden) {
        cap.group.setAttribute("display", "none");
        continue;
      }
      cap.group.removeAttribute("display");
      const isHover = this._hoverKey === cap.def.key;
      const r = isHover ? CAP_R_HOVER : CAP_R;
      cap.circle.setAttribute("r", r);
      cap.circle.setAttribute("cx", "0");
      cap.circle.setAttribute("cy", "0");
      cap.text.setAttribute("x", "0");
      cap.text.setAttribute("y", "0");
      cap.group.setAttribute("transform", `translate(${cap.x.toFixed(2)} ${cap.y.toFixed(2)})`);

      // Far-side caps (negative depth = pointing toward camera, drawn
      // behind) fade slightly. Wait — fwd points INTO scene, so an axis
      // pointing toward camera has NEGATIVE depth, meaning it's the
      // "near" cap visually. Map depth in [-1,1] to opacity [1.0,0.45].
      const t = (cap.depth + 1) * 0.5; // 0=near (toward cam), 1=far (away)
      const opacity = 1.0 - 0.55 * t;
      cap.group.setAttribute("opacity", opacity.toFixed(3));
    }
  }

  destroy() {
    if (this.runtime && this.boundTick)
      this.runtime.removeEventListener("tick", this.boundTick);
    this.boundTick = null;
    if (this._detachDrag) { this._detachDrag(); this._detachDrag = null; }
    this.cc = null;
    this.runtime = null;
    if (this.svg && this.svg.parentNode) this.svg.parentNode.removeChild(this.svg);
  }
}
