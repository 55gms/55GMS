// Reusable Monaco glue for c3script (ported from c3script/sandbox/c3-monaco.js;
// the only change is importing from the single vendored bundle, which re-exports
// the editor-support helpers). Drop-in:
//
//   const ed = new C3Editor(container, { monaco, globals, argEnums, docs, source });
//   const text = ed.getSource();
//
// Provides: JS-based syntax highlighting, live parse diagnostics (red squiggles),
// global-object autocomplete (reflected from `globals`), contextual string
// argument completion (e.g. on("<suggestions>")), and hover docs. No build step
// and no dependency beyond the `monaco` instance you pass in.

import {
  Interpreter, LangError, parse,
  callContextAt, completionPath, describeObject, memberSuggestions,
  collectScriptSymbols, enumValuesFor, docFor, BUILTINS, KEYWORDS,
} from "./c3script.js";
import { collectEnumWarnings } from "./scriptLint.js";

let providersRegistered = false;
const registry = new Map(); // model URI -> C3Editor instance

// Docs for the bare core builtins (editor display only). Members of the globals
// graph (level.*, Math.*, …) carry their own __docs__, resolved via docFor.
const BUILTIN_DOCS = {
  print: "print(...values) — print values to the console.",
  log: "log(...values) — alias of print.",
  len: "len(x) — length of an array, string, or object.",
  keys: "keys(obj) — array of an object's keys.",
  str: "str(x) — convert a value to a string.",
  num: "num(x) — convert a value to a number (or null).",
  bool: "bool(x) — convert a value to a boolean.",
  range: "range(end) or range(start, end, step?) — array of numbers.",
  sleep: "sleep(ms) — await to pause for ms milliseconds (real time).",
  waitAll: "waitAll(values) — await an array of awaitables; resolves to their results.",
};

// First line of a doc, trimmed — shown inline as the completion item's `detail`
// (Monaco's documentation panel is collapsed by default, so inline is what the
// user actually sees while choosing a completion).
function shortDoc(doc) {
  if (!doc) return null;
  const first = String(doc).split("\n")[0];
  return first.length > 90 ? first.slice(0, 87) + "…" : first;
}

export class C3Editor {
  constructor(container, {
    monaco,
    globals = {},
    argEnums = {},
    docs = {},
    source = "",
    language = "c3script",
    theme = "vs-dark",
  } = {}) {
    if (!monaco) throw new Error("C3Editor requires a `monaco` instance");
    this.monaco = monaco;
    this.globals = globals;
    this.argEnums = argEnums;
    this.docs = docs;

    // c3script is its OWN Monaco language (not JavaScript), so the only completion/
    // hover provider in play is ours — no built-in JS IntelliSense competing with it.
    // Must register the language before a model is created with it.
    registerLanguage(monaco, language);

    // Render overflow widgets (the suggest list, hover, parameter hints) into a
    // body-level node instead of inside the editor. The script dialog clips its
    // content (`overflow: hidden`) AND has a `transform` — which would otherwise
    // both clip the completion list and break `position: fixed`, so the list
    // couldn't grow or scroll and Up/Down looked dead past the visible rows.
    this._overflowNode = document.createElement("div");
    this._overflowNode.className = `monaco-editor ${theme}`;
    this._overflowNode.style.position = "absolute";
    this._overflowNode.style.zIndex = "4000";
    document.body.appendChild(this._overflowNode);

    this.editor = monaco.editor.create(container, {
      value: source,
      language,
      theme,
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 14,
      tabSize: 2,
      scrollBeyondLastLine: false,
      fixedOverflowWidgets: true,
      overflowWidgetsDomNode: this._overflowNode,
      // No document-word suggestions — only our c3script completions.
      // (boolean form; Monaco 0.45 predates the "off"/"currentDocument" enum.)
      wordBasedSuggestions: false,
    });
    this.model = this.editor.getModel();
    registry.set(this.model.uri.toString(), this);

    this._lint();
    this.model.onDidChangeContent(() => this._lint());
  }

  getSource() {
    return this.editor.getValue();
  }

  // Markers contributed from outside the lint pass (e.g. runtime errors
  // captured during play). Same shape as scriptLint warnings plus severity:
  // {message, line, column?, endColumn?, severity: "error"|"warning"}.
  // Re-applied on every _lint so they survive content changes.
  setExtraMarkers(extra) {
    this._extraMarkers = Array.isArray(extra) ? extra : [];
    this._lint();
  }

  _extraToMarkers() {
    const monaco = this.monaco;
    const model = this.model;
    return (this._extraMarkers || [])
      .filter((m) => m.line != null)
      .map((m) => {
        const line = Math.min(Math.max(m.line, 1), model.getLineCount());
        return {
          severity:
            m.severity === "warning"
              ? monaco.MarkerSeverity.Warning
              : monaco.MarkerSeverity.Error,
          message: m.message,
          startLineNumber: line,
          startColumn: m.column || 1,
          endLineNumber: line,
          // No column info → cover the whole line.
          endColumn:
            m.endColumn ||
            (m.column ? m.column + 1 : model.getLineMaxColumn(line)),
        };
      });
  }

  // Open Monaco's marker peek ("view problem") at the marker on `line` (picking
  // the one containing `column` when given). Falls back to stepping the marker
  // navigator if the controller API is unavailable.
  showProblemAt(line, column) {
    if (line == null) return false;
    const monaco = this.monaco;
    const markers = monaco.editor.getModelMarkers({
      resource: this.model.uri,
    });
    const marker =
      markers.find(
        (m) =>
          m.startLineNumber === line &&
          column != null &&
          column >= m.startColumn &&
          column <= m.endColumn,
      ) || markers.find((m) => m.startLineNumber === line);
    const ctrl = this.editor.getContribution("editor.contrib.markerController");
    if (marker && ctrl && typeof ctrl.showAtMarker === "function") {
      this.editor.focus();
      ctrl.showAtMarker(marker);
      return true;
    }
    if (!markers.length) return false;
    this.editor.setPosition({ lineNumber: line, column: 1 });
    this.editor.getAction("editor.action.marker.next")?.run();
    return true;
  }

  // Compile + run with fresh state. Returns the Program, or null on error.
  // (Unused by the level editor — scripts run at play time — but kept for parity.)
  run() {
    const vm = new Interpreter();
    vm.defineGlobals(this.globals);
    try {
      const program = vm.compile(this.getSource());
      program.run();
      return program;
    } catch (e) {
      console.error(e instanceof LangError ? "c3script: " + e.format() : e);
      return null;
    }
  }

  dispose() {
    registry.delete(this.model.uri.toString());
    this.editor.dispose();
    if (this._overflowNode && this._overflowNode.parentNode) {
      this._overflowNode.parentNode.removeChild(this._overflowNode);
    }
    this._overflowNode = null;
  }

  // Map a c3script parse error to a Monaco marker; when the source parses,
  // surface unknown-enum-value lint warnings (e.g. level.find("nolabel")).
  // Extra markers (runtime errors) are appended in both cases.
  _lint() {
    const monaco = this.monaco;
    const source = this.model.getValue();
    let markers;
    try {
      parse(source);
      markers = collectEnumWarnings(source, this.globals).map((w) => ({
        severity: monaco.MarkerSeverity.Warning,
        message: w.message,
        startLineNumber: w.line || 1,
        startColumn: w.column || 1,
        endLineNumber: w.line || 1,
        endColumn: w.endColumn || (w.column || 1) + 1,
      }));
    } catch (e) {
      const line = e && e.line ? e.line : 1;
      const col = e && e.column ? e.column : 1;
      markers = [{
        severity: monaco.MarkerSeverity.Error,
        message: (e && e.langMessage) || String(e),
        startLineNumber: line,
        startColumn: col,
        endLineNumber: line,
        endColumn: col + 1,
      }];
    }
    const all = [...markers, ...this._extraToMarkers()];
    monaco.editor.setModelMarkers(this.model, "c3", all);

    // The marker peek ("view problem" widget) snapshots the marker list when it
    // opens, so once the set changes it shows a dead problem and a stale count.
    // Close it whenever the set actually changes; MarkerController.close() is a
    // safe no-op when the widget isn't open.
    const sig = JSON.stringify(
      all.map((m) => [m.severity, m.startLineNumber, m.startColumn, m.message]),
    );
    if (this._markerSig !== undefined && sig !== this._markerSig) {
      try {
        const ctrl = this.editor.getContribution(
          "editor.contrib.markerController",
        );
        if (ctrl && typeof ctrl.close === "function") ctrl.close(false);
      } catch (_) {}
    }
    this._markerSig = sig;
  }
}

function registerLanguage(monaco, language) {
  if (providersRegistered) return;
  providersRegistered = true;

  // Register c3script as a first-class Monaco language: tokenizer (highlighting),
  // language configuration (comments/brackets/auto-close), and our providers.
  monaco.languages.register({ id: language });
  monaco.languages.setLanguageConfiguration(language, {
    comments: { lineComment: "//", blockComment: ["/*", "*/"] },
    brackets: [["{", "}"], ["[", "]"], ["(", ")"]],
    autoClosingPairs: [
      { open: "{", close: "}" }, { open: "[", close: "]" }, { open: "(", close: ")" },
      { open: '"', close: '"' }, { open: "'", close: "'" },
    ],
    surroundingPairs: [
      { open: "{", close: "}" }, { open: "[", close: "]" }, { open: "(", close: ")" },
      { open: '"', close: '"' }, { open: "'", close: "'" },
    ],
  });
  // `of` is a CONTEXTUAL keyword in c3script (the parser matches it as an
  // identifier inside `for (let x of …)`, so it's deliberately absent from the
  // real KEYWORDS set — adding it there would break the lexer/parser). For
  // highlighting only, we treat it as a keyword so `for … of` colours correctly.
  const highlightKeywords = KEYWORDS.includes("of")
    ? KEYWORDS
    : [...KEYWORDS, "of"];

  monaco.languages.setMonarchTokensProvider(language, {
    defaultToken: "",
    keywords: highlightKeywords,
    builtins: BUILTINS,
    tokenizer: {
      root: [
        [/\/\/.*$/, "comment"],
        [/\/\*/, "comment", "@comment"],
        [/[A-Za-z_$][\w$]*/, {
          cases: { "@keywords": "keyword", "@builtins": "predefined", "@default": "identifier" },
        }],
        [/\d+\.?\d*([eE][-+]?\d+)?/, "number"],
        [/"([^"\\]|\\.)*"/, "string"],
        [/'([^'\\]|\\.)*'/, "string"],
        [/[{}()[\]]/, "@brackets"],
        [/[;,.]/, "delimiter"],
      ],
      comment: [
        [/[^*]+/, "comment"],
        [/\*\//, "comment", "@pop"],
        [/./, "comment"],
      ],
    },
  });

  monaco.languages.registerCompletionItemProvider(language, {
    triggerCharacters: [".", '"', "'"],
    provideCompletionItems(model, position) {
      const inst = registry.get(model.uri.toString());
      if (!inst) return { suggestions: [] };

      const K = monaco.languages.CompletionItemKind;
      const snippetRule = monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet;

      const prefix = model.getValueInRange({
        startLineNumber: 1, startColumn: 1,
        endLineNumber: position.lineNumber, endColumn: position.column,
      });
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber, endLineNumber: position.lineNumber,
        startColumn: word.startColumn, endColumn: word.endColumn,
      };

      // 1. Contextual string-argument enum: on("<here>")
      const ctx = callContextAt(prefix);
      if (ctx && ctx.inString) {
        const values = enumValuesFor(ctx, { globals: inst.globals, argEnums: inst.argEnums });
        if (!values) return { suggestions: [] };
        return {
          suggestions: values.map((v) => ({
            label: v, kind: K.EnumMember, insertText: v, range,
          })),
        };
      }

      const withDoc = (item, doc) =>
        doc ? { ...item, documentation: { value: doc } } : item;

      const fnItem = (name) => {
        const doc = BUILTIN_DOCS[name];
        return withDoc({
          label: name, kind: K.Function, detail: shortDoc(doc) || "builtin",
          insertText: name + "($0)", insertTextRules: snippetRule, range,
        }, doc);
      };
      // `path` is the dotted receiver path, used to resolve docs (schema or
      // the receiver's __docs__ convention) for each member. The doc's first
      // line becomes the inline `detail` so it's visible without expanding.
      const memberItem = (d, path) => {
        const doc = docFor(inst.globals, inst.docs, path, d.name);
        const baseDetail =
          d.kind === "function" && d.arity != null ? `function(${d.arity} args)` : d.kind;
        return withDoc({
          label: d.name,
          kind: d.kind === "function" ? K.Method : d.kind === "object" ? K.Module : K.Field,
          detail: shortDoc(doc) || baseDetail,
          insertText: d.kind === "function" ? d.name + "($0)" : d.name,
          insertTextRules: d.kind === "function" ? snippetRule : undefined,
          range,
        }, doc);
      };

      // 2. Member completion after a dot. Resolves the root through inferred
      // local-variable types (e.g. `let p = game.objects.player; p.`) and the
      // live globals graph. Parse only the lines BEFORE the cursor: the line being
      // typed (`p.`) is incomplete and would otherwise break alias inference.
      const cp = completionPath(prefix);
      if (cp.isMember) {
        const source = inst.getSource().split("\n").slice(0, position.lineNumber - 1).join("\n");
        const members = memberSuggestions(cp.path, { globals: inst.globals, source });
        return { suggestions: members.map((d) => memberItem(d, cp.path)) };
      }

      // 3. Top-level: globals + builtins + the user's own declarations + keywords.
      // De-dupe by label so the four sources don't produce repeats.
      const out = [];
      const seen = new Set();
      const add = (item) => { if (!seen.has(item.label)) { seen.add(item.label); out.push(item); } };

      for (const d of describeObject(inst.globals)) add(memberItem(d, []));
      for (const name of BUILTINS) add(fnItem(name));
      for (const s of collectScriptSymbols(inst.getSource())) {
        add({
          label: s.name,
          kind: s.kind === "function" ? K.Function : s.kind === "class" ? K.Class : K.Variable,
          detail: s.kind, insertText: s.name, range,
        });
      }
      for (const kw of KEYWORDS) {
        add({ label: kw, kind: K.Keyword, detail: "keyword", insertText: kw, range });
      }
      return { suggestions: out };
    },
  });

  // Hover: show a prop's doc (from the `docs` schema or a `__docs__` convention).
  monaco.languages.registerHoverProvider(language, {
    provideHover(model, position) {
      const inst = registry.get(model.uri.toString());
      if (!inst) return null;
      const word = model.getWordAtPosition(position);
      if (!word) return null;
      // The dotted path ending at the hovered word (e.g. level.find).
      const lineToWord = model.getValueInRange({
        startLineNumber: position.lineNumber, startColumn: 1,
        endLineNumber: position.lineNumber, endColumn: word.endColumn,
      });
      const m = lineToWord.match(/[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/);
      if (!m) return null;
      const parts = m[0].split(".");
      const name = parts.pop();
      const doc = docFor(inst.globals, inst.docs, parts, name);
      if (!doc) return null;
      return {
        range: new monaco.Range(
          position.lineNumber, word.startColumn, position.lineNumber, word.endColumn,
        ),
        contents: [{ value: doc }],
      };
    },
  });
}
