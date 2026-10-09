// Static warning pass for level scripts: flag STRING-LITERAL arguments to API
// calls whose declared value set (__argEnums__ on the schema receiver) does not
// contain the literal — e.g. level.find("dooor") when no label is named "dooor".
//
// Deliberately conservative — these are warnings, not errors:
// - Only literal strings are checked (plus string literals inside array-literal
//   arguments for wildcard enums like find/findAll). A computed value can't be
//   known here, so it is never flagged.
// - Only receivers reachable as a static global path (level.…, Audio.…) are
//   resolved; variables holding API objects are not traced.
// - on/off/emit are skipped: event names are an OPEN set (scripts define custom
//   events via emit), so an unknown name there is not a mistake.
import { parse, resolvePathValue } from "./c3script.js";

const OPEN_SET_METHODS = new Set(["on", "off", "emit"]);
const MAX_LISTED = 6;

// Member-chain callee receiver → global path, e.g. `level.find` → ["level"].
function receiverPath(node) {
  const parts = [];
  let n = node;
  while (n && n.type === "Member") {
    parts.unshift(n.property);
    n = n.object;
  }
  if (!n || n.type !== "Identifier") return null;
  return [n.name, ...parts];
}

function expectedList(allowed) {
  const shown = allowed
    .slice(0, MAX_LISTED)
    .map((v) => `"${v}"`)
    .join(", ");
  return allowed.length > MAX_LISTED ? `${shown}, …` : shown;
}

// Best-effort column range of the quoted literal on its line (1-based).
// AST nodes only carry `line`, so the column comes from scanning the text.
function literalColumns(lines, line, value) {
  const text = line != null ? lines[line - 1] : null;
  if (!text) return null;
  for (const q of ['"', "'"]) {
    const idx = text.indexOf(q + value + q);
    if (idx >= 0) return { column: idx + 1, endColumn: idx + value.length + 3 };
  }
  return null;
}

/**
 * Parse `source` and return warnings for unknown enum string literals.
 * Returns [] when the source doesn't parse (parse errors are reported
 * separately) or when nothing is flagged.
 *
 * @param {string} source - script source
 * @param {object} globals - the editor schema graph (buildApiSchema + stdlib),
 *   whose modules carry __argEnums__
 * @returns {{message:string, line:number|null, column:number|null,
 *            endColumn:number|null, severity:"warning"}[]}
 */
export function collectEnumWarnings(source, globals) {
  let ast;
  try {
    ast = parse(source);
  } catch {
    return [];
  }
  const lines = String(source).split("\n");
  const warnings = [];

  const checkLiteral = (node, allowed, calleeName) => {
    if (!node || node.type !== "StringLit") return;
    if (allowed.includes(node.value)) return;
    const pos = literalColumns(lines, node.line, node.value) || {};
    warnings.push({
      message: `"${node.value}" is not a known value for ${calleeName} — expected one of: ${expectedList(allowed)}`,
      line: node.line ?? null,
      column: pos.column ?? null,
      endColumn: pos.endColumn ?? null,
      severity: "warning",
    });
  };

  const checkCall = (call) => {
    const callee = call.callee;
    if (!callee || callee.type !== "Member") return;
    const method = callee.property;
    if (OPEN_SET_METHODS.has(method)) return;
    const path = receiverPath(callee.object);
    if (!path) return;
    const receiver = resolvePathValue(globals, path);
    const conv =
      receiver && typeof receiver === "object" && receiver.__argEnums__
        ? receiver.__argEnums__[method]
        : null;
    if (!conv) return;
    const calleeName = [...path, method].join(".");
    call.args.forEach((arg, i) => {
      if (Array.isArray(conv)) {
        // Wildcard enum: applies to every arg and array element (find/findAll).
        if (arg.type === "ArrayLit") {
          for (const el of arg.elements) checkLiteral(el, conv, calleeName);
        } else {
          checkLiteral(arg, conv, calleeName);
        }
      } else if (Array.isArray(conv[i])) {
        checkLiteral(arg, conv[i], calleeName);
      }
    });
  };

  // Generic tree walk — the AST is a plain-object tree with .type tags, so
  // recursing into every object/array property visits all expressions.
  const walk = (n) => {
    if (Array.isArray(n)) {
      for (const c of n) walk(c);
      return;
    }
    if (!n || typeof n !== "object") return;
    if (n.type === "Call") checkCall(n);
    for (const key of Object.keys(n)) {
      const v = n[key];
      if (v && typeof v === "object") walk(v);
    }
  };
  walk(ast.body);
  return warnings;
}
