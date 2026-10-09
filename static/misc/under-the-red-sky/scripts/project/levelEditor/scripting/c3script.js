/* c3script — sandboxed JS-like scripting language (MIT) */

// src/errors.js
var LangError = class extends Error {
  constructor(message, { line = null, column = null, phase = "runtime", stack = null } = {}) {
    super(message);
    this.name = "LangError";
    this.langMessage = message;
    this.line = line;
    this.column = column;
    this.phase = phase;
    this.scriptStack = stack;
  }
  format() {
    const loc = this.line != null ? ` at line ${this.line}${this.column != null ? `:${this.column}` : ""}` : "";
    let out = `${this.phase} error${loc}: ${this.langMessage}`;
    if (this.scriptStack && this.scriptStack.length) {
      out += "\n" + this.scriptStack.map((f) => `  at ${f.name}${f.line != null ? ` (line ${f.line})` : ""}`).join("\n");
    }
    return out;
  }
};

// src/environment.js
var Environment = class _Environment {
  constructor(parent = null) {
    this.vars = /* @__PURE__ */ new Map();
    this.consts = /* @__PURE__ */ new Set();
    this.parent = parent;
  }
  child() {
    return new _Environment(this);
  }
  define(name, value, isConst = false) {
    this.vars.set(name, value);
    if (isConst) this.consts.add(name);
    else this.consts.delete(name);
  }
  get(name, line) {
    let env = this;
    while (env) {
      if (env.vars.has(name)) return env.vars.get(name);
      env = env.parent;
    }
    throw new LangError(`undefined variable '${name}'`, { line, phase: "runtime" });
  }
  assign(name, value, line) {
    let env = this;
    while (env) {
      if (env.vars.has(name)) {
        if (env.consts.has(name)) {
          throw new LangError(`cannot assign to const '${name}'`, { line, phase: "runtime" });
        }
        env.vars.set(name, value);
        return value;
      }
      env = env.parent;
    }
    throw new LangError(`undefined variable '${name}'`, { line, phase: "runtime" });
  }
};

// src/values.js
var Closure = class {
  constructor(params, body, env, name = null, homeClass = null) {
    this.params = params;
    this.body = body;
    this.env = env;
    this.name = name;
    this.homeClass = homeClass;
  }
};
var NativeFn = class {
  constructor(fn, name = "native", receiver = void 0, raw = false) {
    this.fn = fn;
    this.name = name;
    this.receiver = receiver;
    this.raw = raw;
  }
};
var ClassValue = class {
  constructor(name, methods, ctor, parent = null) {
    this.name = name;
    this.methods = methods;
    this.ctor = ctor;
    this.parent = parent;
  }
};
var Instance = class {
  constructor(klass) {
    this.klass = klass;
    this.fields = /* @__PURE__ */ new Map();
  }
};
var HostObject = class {
  constructor(obj, policy = { writable: true, extensible: true }) {
    this.obj = obj;
    this.policy = policy;
  }
};
function isCallable(v) {
  return v instanceof Closure || v instanceof NativeFn;
}
function isPrivateKey(k) {
  return typeof k === "string" && k.startsWith("__");
}
function defaultCompare(a, b) {
  if (a === b) return 0;
  if (a === null || a === void 0) return b === null || b === void 0 ? 0 : -1;
  if (b === null || b === void 0) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  const sa = String(a);
  const sb = String(b);
  return sa < sb ? -1 : sa > sb ? 1 : 0;
}
function shuffleInPlace(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}
function isTruthy(v) {
  if (v === null || v === void 0) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0 && !Number.isNaN(v);
  if (typeof v === "string") return v.length > 0;
  return true;
}
function typeName(v) {
  if (v === null || v === void 0) return "null";
  if (typeof v === "number") return "number";
  if (typeof v === "string") return "string";
  if (typeof v === "boolean") return "bool";
  if (Array.isArray(v)) return "array";
  if (v instanceof Map) return "object";
  if (v instanceof Closure || v instanceof NativeFn) return "function";
  if (v instanceof ClassValue) return "class";
  if (v instanceof Instance) return "instance";
  if (v instanceof HostObject) return "object";
  if (v instanceof Promise) return "promise";
  return "unknown";
}
function stringify(v, seen = /* @__PURE__ */ new Set()) {
  if (v === null || v === void 0) return "null";
  if (typeof v === "string") return v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    if (seen.has(v)) return "[...]";
    seen.add(v);
    const r = "[" + v.map((x) => stringify(x, seen)).join(", ") + "]";
    seen.delete(v);
    return r;
  }
  if (v instanceof Map) {
    if (seen.has(v)) return "{...}";
    seen.add(v);
    const parts = [];
    for (const [k, val] of v) parts.push(`${k}: ${stringify(val, seen)}`);
    seen.delete(v);
    return "{" + parts.join(", ") + "}";
  }
  if (v instanceof Closure) return `<function ${v.name || "anonymous"}>`;
  if (v instanceof NativeFn) return `<native ${v.name}>`;
  if (v instanceof ClassValue) return `<class ${v.name}>`;
  if (v instanceof Instance) return `<${v.klass.name} instance>`;
  if (v instanceof HostObject) return stringifyHost(v.obj);
  if (v instanceof Promise) return "<promise>";
  return String(v);
}
function stringifyHost(obj) {
  if (Array.isArray(obj)) return "[" + obj.map((x) => stringify(x)).join(", ") + "]";
  if (typeof obj === "function") return "<native function>";
  if (obj && typeof obj === "object") {
    const parts = [];
    for (const k of Object.keys(obj)) {
      if (isPrivateKey(k)) continue;
      parts.push(`${k}: ...`);
    }
    return "{" + parts.join(", ") + "}";
  }
  return String(obj);
}

// src/host.js
var DEFAULT_POLICY = { writable: true, extensible: true };
function childPolicy(policy, key) {
  const f = policy.fields && policy.fields[key];
  if (!f) return { writable: policy.writable, extensible: policy.extensible };
  return {
    writable: f.writable ?? policy.writable,
    extensible: f.extensible ?? policy.extensible,
    fields: f.fields
    // may be undefined; recursion stops if so
  };
}
var DANGEROUS_KEYS = /* @__PURE__ */ new Set(["__proto__", "constructor", "prototype"]);
var hostWrapperCache = /* @__PURE__ */ new WeakMap();
function wrapHost(obj, policy) {
  const cacheable = policy && policy.writable && policy.extensible && !policy.fields;
  if (!cacheable) return new HostObject(obj, policy);
  let w = hostWrapperCache.get(obj);
  if (!w) {
    w = new HostObject(obj, policy);
    hostWrapperCache.set(obj, w);
  }
  return w;
}
function hostToScript(v, policy = DEFAULT_POLICY) {
  if (v === null || v === void 0) return null;
  const t = typeof v;
  if (t === "number" || t === "string" || t === "boolean") return v;
  if (v instanceof Promise) return v;
  if (t === "function") return new NativeFn(v, v.name || "native");
  if (v instanceof Closure || v instanceof NativeFn || v instanceof ClassValue || v instanceof Instance || v instanceof HostObject || v instanceof Map) {
    return v;
  }
  if (Array.isArray(v) || t === "object") return wrapHost(v, policy);
  return v;
}
function scriptToHost(v, seen = /* @__PURE__ */ new Set()) {
  if (v === null || v === void 0) return null;
  const t = typeof v;
  if (t === "number" || t === "string" || t === "boolean") return v;
  if (v instanceof HostObject) return v.obj;
  if (v instanceof NativeFn) return v.fn;
  if (Array.isArray(v)) {
    if (seen.has(v)) throw new LangError("cannot pass a cyclic structure to the host", { phase: "runtime" });
    seen.add(v);
    const out = v.map((x) => scriptToHost(x, seen));
    seen.delete(v);
    return out;
  }
  if (v instanceof Map) {
    if (seen.has(v)) throw new LangError("cannot pass a cyclic structure to the host", { phase: "runtime" });
    seen.add(v);
    const o = {};
    for (const [k, val] of v) {
      if (DANGEROUS_KEYS.has(String(k))) continue;
      o[k] = scriptToHost(val, seen);
    }
    seen.delete(v);
    return o;
  }
  return v;
}
function hostGet(host, key) {
  const target = host.obj;
  const k = typeof key === "number" ? key : String(key);
  if (Array.isArray(target) && (k === "len" || k === "length")) {
    return target.length;
  }
  if (isPrivateKey(k)) return null;
  if (DANGEROUS_KEYS.has(k)) return null;
  if (target == null || !Object.hasOwn(target, k)) return null;
  const val = target[k];
  if (typeof val === "function") return new NativeFn(val, k, target);
  if (val instanceof Promise) return val;
  if (val !== null && typeof val === "object" && !(val instanceof HostObject) && !(val instanceof Map) && !(val instanceof ClassValue) && !(val instanceof Instance) && !(val instanceof Closure) && !(val instanceof NativeFn)) {
    return wrapHost(val, childPolicy(host.policy, k));
  }
  return hostToScript(val, childPolicy(host.policy, k));
}
function hostSet(host, key, value) {
  const k = typeof key === "number" ? key : String(key);
  if (isPrivateKey(k) || DANGEROUS_KEYS.has(k)) {
    throw new LangError(`cannot set unsafe property '${k}'`, { phase: "runtime" });
  }
  const p = host.policy || DEFAULT_POLICY;
  const fp = p.fields && p.fields[k];
  const writable = fp && fp.writable != null ? fp.writable : p.writable;
  if (!writable) {
    throw new LangError(`cannot modify read-only property '${k}'`, { phase: "runtime" });
  }
  const exists = Array.isArray(host.obj) ? typeof key === "number" && key < host.obj.length : Object.hasOwn(host.obj, k);
  if (!exists && !p.extensible) {
    throw new LangError(`cannot add new property '${k}' to a sealed object`, { phase: "runtime" });
  }
  host.obj[k] = scriptToHost(value);
  return value;
}
function defineGlobal(env, name, value, { writable = true, extensible = true, fields } = {}) {
  env.define(name, hostToScript(value, { writable, extensible, fields }));
}
function defineGlobals(env, obj, options = {}) {
  for (const name of Object.keys(obj)) {
    defineGlobal(env, name, obj[name], options);
  }
}

// src/interpreter.js
var ReturnSignal = class {
  constructor(value) {
    this.value = value;
  }
};
var BreakSignal = class {
};
var ContinueSignal = class {
};
var SUPER = /* @__PURE__ */ Symbol("superctx");
function valuesEqual(a, b) {
  if (a === null || a === void 0) return b === null || b === void 0;
  return a === b;
}
var Evaluator = class {
  constructor() {
    this.maxSteps = 1e6;
    this.onStep = null;
    this.steps = 0;
    this.callStack = [];
  }
  reset({ maxSteps = 1e6, onStep = null } = {}) {
    this.maxSteps = maxSteps;
    this.onStep = onStep;
    this.steps = 0;
    this.callStack = [];
    return this;
  }
  stackTrace() {
    return this.callStack.slice().reverse();
  }
  runtimeError(message, line) {
    return new LangError(message, { line, phase: "runtime", stack: this.stackTrace() });
  }
  // Count a step and enforce the fuel limit. Called by drivers (run + debugger)
  // at each yielded checkpoint.
  stepCheck(checkpoint) {
    this.steps++;
    if (this.maxSteps && this.steps > this.maxSteps) {
      throw this.runtimeError(
        `step limit exceeded (${this.maxSteps}) \u2014 possible infinite loop`,
        checkpoint && checkpoint.line
      );
    }
    if (this.onStep) this.onStep(checkpoint);
  }
  // Drive a generator to completion (normal run; no pausing). A JS stack
  // overflow (runaway recursion / huge structure) is converted to a clean error.
  // Drive a generator to a result. Runs synchronously and returns the value
  // directly; if the script suspends on `await`, hands off to continueAsync and
  // returns a Promise from that point on. So a fully-synchronous script never
  // touches a Promise, while an async one transparently becomes awaitable —
  // callers can `await` the result either way (awaiting a plain value is a no-op),
  // and there is a single run/call/invoke API regardless of whether a script awaits.
  drive(gen) {
    try {
      let res = gen.next();
      while (!res.done) {
        if (res.value && res.value.__await) {
          return this.continueAsync(gen, res);
        }
        this.stepCheck(res.value);
        res = gen.next();
      }
      return res.value;
    } catch (e) {
      if (e instanceof RangeError) {
        throw this.runtimeError("call stack exhausted (too much recursion)", null);
      }
      throw e;
    }
  }
  // Async continuation of drive(): resumes pumping once a script has suspended on
  // its first await-signal (`{ __await, promise }`). Awaits each promise and feeds
  // the resolved value back in. A rejection is injected via gen.throw() so every
  // frame's `finally` (callStack.pop) runs as it unwinds to the host.
  async continueAsync(gen, res) {
    try {
      while (!res.done) {
        if (res.value && res.value.__await) {
          const line = res.value.line;
          let v;
          try {
            v = await Promise.resolve(res.value.promise);
          } catch (err) {
            const langErr = err instanceof LangError ? err : this.runtimeError(`awaited promise rejected: ${err && err.message}`, line);
            res = gen.throw(langErr);
            continue;
          }
          res = gen.next(hostToScript(v));
        } else {
          this.stepCheck(res.value);
          res = gen.next();
        }
      }
      return res.value;
    } catch (e) {
      if (e instanceof RangeError) {
        throw this.runtimeError("call stack exhausted (too much recursion)", null);
      }
      throw e;
    }
  }
  // Run a script callable to completion SYNCHRONOUSLY, sharing the current run's
  // steps/fuel (unlike Program.call/invoke, which reset). Refuses to suspend: it
  // throws if the callable hits an `await`. Used so a native array method (sort,
  // filter, map, …) can call a script callback and get a value back without
  // going async. `what` names the callback in the error message.
  driveSync(gen, line, what = "sort comparator") {
    let res = gen.next();
    while (!res.done) {
      if (res.value && res.value.__await) {
        throw this.runtimeError(`cannot 'await' inside a ${what}`, line);
      }
      this.stepCheck(res.value);
      res = gen.next();
    }
    return res.value;
  }
  // Build a JS comparator from an optional script compareFn. `wrap` marshals each
  // element to a script value before the comparator sees it (identity for native
  // script arrays, host→script for host arrays). A compareFn may return a number
  // (JS-style: <0 / 0 / >0) OR a boolean ("a before b"). No compareFn → natural order.
  sortComparator(compareFn, line, wrap) {
    if (compareFn == null) return defaultCompare;
    if (!isCallable(compareFn)) {
      throw this.runtimeError(
        `sort(compareFn) expects a function, got ${typeName(compareFn)}`,
        line
      );
    }
    return (a, b) => {
      const r = this.driveSync(this.callValue(compareFn, [wrap(a), wrap(b)], line), line);
      if (typeof r === "number") return r;
      return isTruthy(r) ? -1 : 1;
    };
  }
  // Build a sync `(element, index) => scriptValue` runner from a script callback
  // for filter/find/findIndex/some/every/map. `wrap` marshals the element to a
  // script value first (identity for native arrays, host→script for host arrays).
  callbackRunner(fn, line, wrap, name) {
    if (!isCallable(fn)) {
      throw this.runtimeError(
        `${name}(callback) expects a function, got ${typeName(fn)}`,
        line
      );
    }
    return (x, i) => this.driveSync(this.callValue(fn, [wrap(x), i], line), line, `${name} callback`);
  }
  // The callback-taking array members shared by native and host arrays.
  // `wrap` marshals elements script-ward; `wrapArr` turns a filtered JS array
  // back into the right array value (plain array / HostObject).
  arrayCallbackMember(arr, name, line, wrap, wrapArr) {
    const runner = (fn) => this.callbackRunner(fn, line, wrap, name);
    switch (name) {
      case "filter":
        return new NativeFn((fn) => {
          const cb = runner(fn);
          return wrapArr(arr.filter((x, i) => isTruthy(cb(x, i))));
        }, "filter", void 0, true);
      case "find":
        return new NativeFn((fn) => {
          const cb = runner(fn);
          const i = arr.findIndex((x, j) => isTruthy(cb(x, j)));
          return i === -1 ? null : wrap(arr[i]);
        }, "find", void 0, true);
      case "findIndex":
        return new NativeFn((fn) => {
          const cb = runner(fn);
          return arr.findIndex((x, i) => isTruthy(cb(x, i)));
        }, "findIndex", void 0, true);
      case "some":
        return new NativeFn((fn) => {
          const cb = runner(fn);
          return arr.some((x, i) => isTruthy(cb(x, i)));
        }, "some", void 0, true);
      case "every":
        return new NativeFn((fn) => {
          const cb = runner(fn);
          return arr.every((x, i) => isTruthy(cb(x, i)));
        }, "every", void 0, true);
      case "map":
        return new NativeFn((fn) => {
          const cb = runner(fn);
          return arr.map((x, i) => cb(x, i));
        }, "map", void 0, true);
      default:
        return void 0;
    }
  }
  // ---- statements ----
  *execProgram(program, env) {
    try {
      yield* this.execStatements(program.body, env);
    } catch (e) {
      if (e instanceof ReturnSignal) return e.value;
      if (e instanceof BreakSignal || e instanceof ContinueSignal) {
        throw this.runtimeError("'break'/'continue' used outside of a loop", null);
      }
      throw e;
    }
    return null;
  }
  *execStatements(list, env) {
    for (const stmt of list) yield* this.execStmt(stmt, env);
  }
  *execStmt(stmt, env) {
    yield { line: stmt.line, kind: stmt.type, env };
    switch (stmt.type) {
      case "VarDecl": {
        const value = stmt.init ? yield* this.evalExpr(stmt.init, env) : null;
        env.define(stmt.name, value, stmt.kind === "const");
        return;
      }
      case "FunctionDecl": {
        env.define(stmt.name, new Closure(stmt.params, stmt.body, env, stmt.name));
        return;
      }
      case "ClassDecl": {
        let parent = null;
        if (stmt.superClass) {
          parent = yield* this.evalExpr(stmt.superClass, env);
          if (!(parent instanceof ClassValue)) {
            throw this.runtimeError(`class '${stmt.name}' cannot extend a non-class`, stmt.line);
          }
        }
        env.define(stmt.name, this.makeClass(stmt, env, parent));
        return;
      }
      case "ReturnStmt": {
        const value = stmt.argument ? yield* this.evalExpr(stmt.argument, env) : null;
        throw new ReturnSignal(value);
      }
      case "IfStmt": {
        if (isTruthy(yield* this.evalExpr(stmt.test, env))) {
          yield* this.execStmt(stmt.consequent, env);
        } else if (stmt.alternate) {
          yield* this.execStmt(stmt.alternate, env);
        }
        return;
      }
      case "WhileStmt": {
        while (isTruthy(yield* this.evalExpr(stmt.test, env))) {
          try {
            yield* this.execStmt(stmt.body, env);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        return;
      }
      case "ForStmt": {
        const scope = env.child();
        if (stmt.init) yield* this.execStmt(stmt.init, scope);
        const perIter = !!(stmt.init && stmt.init.type === "VarDecl");
        const name = perIter ? stmt.init.name : null;
        const isConst = perIter && stmt.init.kind === "const";
        let cur = perIter ? this.iterEnv(env, scope, name, isConst) : scope;
        while (stmt.test === null || isTruthy(yield* this.evalExpr(stmt.test, cur))) {
          try {
            yield* this.execStmt(stmt.body, cur);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (!(e instanceof ContinueSignal)) throw e;
          }
          if (perIter) cur = this.iterEnv(env, cur, name, isConst);
          if (stmt.update) yield* this.evalExpr(stmt.update, cur);
        }
        return;
      }
      case "ForOfStmt": {
        const iterable = yield* this.evalExpr(stmt.iterable, env);
        const items = this.toIterable(iterable, stmt.line);
        for (const item of items) {
          const scope = env.child();
          scope.define(stmt.name, item, stmt.kind === "const");
          try {
            yield* this.execStmt(stmt.body, scope);
          } catch (e) {
            if (e instanceof BreakSignal) break;
            if (e instanceof ContinueSignal) continue;
            throw e;
          }
        }
        return;
      }
      case "BreakStmt":
        throw new BreakSignal();
      case "ContinueStmt":
        throw new ContinueSignal();
      case "BlockStmt": {
        yield* this.execStatements(stmt.body, env.child());
        return;
      }
      case "ExprStmt": {
        yield* this.evalExpr(stmt.expression, env);
        return;
      }
      default:
        throw this.runtimeError(`cannot execute statement '${stmt.type}'`, stmt.line);
    }
  }
  makeClass(stmt, env, parent = null) {
    const methods = /* @__PURE__ */ new Map();
    const klass = new ClassValue(stmt.name, methods, null, parent);
    for (const m of stmt.members) {
      const closure = new Closure(m.params, m.body, env, `${stmt.name}.${m.name}`, klass);
      if (m.isCtor) klass.ctor = closure;
      else methods.set(m.name, closure);
    }
    return klass;
  }
  // Walk the inheritance chain for a method / constructor.
  findMethod(klass, name) {
    for (let k = klass; k; k = k.parent) {
      if (k.methods.has(name)) return k.methods.get(name);
    }
    return null;
  }
  findConstructor(klass) {
    for (let k = klass; k; k = k.parent) {
      if (k.ctor) return k.ctor;
    }
    return null;
  }
  // ---- expressions (return a value) ----
  *evalExpr(node2, env) {
    switch (node2.type) {
      case "NumberLit":
      case "StringLit":
      case "BoolLit":
        return node2.value;
      case "NullLit":
        return null;
      case "Identifier":
        return env.get(node2.name, node2.line);
      case "ThisExpr":
        return env.get("this", node2.line);
      case "ArrayLit": {
        const arr = [];
        for (const el of node2.elements) arr.push(yield* this.evalExpr(el, env));
        return arr;
      }
      case "ObjectLit": {
        const map = /* @__PURE__ */ new Map();
        for (const p of node2.properties) map.set(p.key, yield* this.evalExpr(p.value, env));
        return map;
      }
      case "FunctionExpr": {
        if (node2.name) {
          const scope = env.child();
          const fn = new Closure(node2.params, node2.body, scope, node2.name);
          scope.define(node2.name, fn, true);
          return fn;
        }
        return new Closure(node2.params, node2.body, env, null);
      }
      case "Unary": {
        const v = yield* this.evalExpr(node2.argument, env);
        if (node2.op === "typeof") return typeName(v);
        if (node2.op === "!") return !isTruthy(v);
        if (node2.op === "-") {
          if (typeof v !== "number") {
            throw this.runtimeError(`cannot negate ${typeName(v)}`, node2.line);
          }
          return -v;
        }
        throw this.runtimeError(`unknown unary operator '${node2.op}'`, node2.line);
      }
      case "Binary": {
        const l = yield* this.evalExpr(node2.left, env);
        const r = yield* this.evalExpr(node2.right, env);
        return this.applyBinary(node2.op, l, r, node2.line);
      }
      case "Logical": {
        const l = yield* this.evalExpr(node2.left, env);
        if (node2.op === "&&") return isTruthy(l) ? yield* this.evalExpr(node2.right, env) : l;
        return isTruthy(l) ? l : yield* this.evalExpr(node2.right, env);
      }
      case "Ternary": {
        const test = yield* this.evalExpr(node2.test, env);
        return isTruthy(test) ? yield* this.evalExpr(node2.consequent, env) : yield* this.evalExpr(node2.alternate, env);
      }
      case "Await": {
        const p = yield* this.evalExpr(node2.argument, env);
        const resolved = yield { __await: true, promise: p, line: node2.line };
        return resolved;
      }
      case "Update":
        return yield* this.evalUpdate(node2, env);
      case "Assign":
        return yield* this.evalAssign(node2, env);
      case "Member": {
        if (node2.object.type === "SuperExpr") {
          const ctx = this.superContext(env, node2.line);
          const method = this.findMethod(ctx.parentClass, node2.property);
          if (!method) throw this.runtimeError(`'super' has no method '${node2.property}'`, node2.line);
          return this.bindThis(method, ctx.instance);
        }
        const obj = yield* this.evalExpr(node2.object, env);
        return this.getMember(obj, node2.property, node2.line);
      }
      case "Index": {
        const obj = yield* this.evalExpr(node2.object, env);
        const idx = yield* this.evalExpr(node2.index, env);
        return this.getIndex(obj, idx, node2.line);
      }
      case "Call": {
        if (node2.callee.type === "SuperExpr") {
          const ctx = this.superContext(env, node2.line);
          const args2 = [];
          for (const a of node2.args) args2.push(yield* this.evalExpr(a, env));
          const ctor = this.findConstructor(ctx.parentClass);
          if (ctor) yield* this.callValue(this.bindThis(ctor, ctx.instance), args2, node2.line);
          return null;
        }
        const fn = yield* this.evalExpr(node2.callee, env);
        const args = [];
        for (const a of node2.args) args.push(yield* this.evalExpr(a, env));
        return yield* this.callValue(fn, args, node2.line);
      }
      case "SuperExpr":
        throw this.runtimeError("'super' must be used as super(...) or super.method(...)", node2.line);
      case "NewExpr": {
        const klass = yield* this.evalExpr(node2.callee, env);
        if (!(klass instanceof ClassValue)) {
          throw this.runtimeError(`'new' requires a class, got ${typeName(klass)}`, node2.line);
        }
        const inst = new Instance(klass);
        const args = [];
        for (const a of node2.args) args.push(yield* this.evalExpr(a, env));
        const ctor = this.findConstructor(klass);
        if (ctor) {
          yield* this.callValue(this.bindThis(ctor, inst), args, node2.line);
        }
        return inst;
      }
      default:
        throw this.runtimeError(`cannot evaluate expression '${node2.type}'`, node2.line);
    }
  }
  *evalAssign(node2, env) {
    const rhs = yield* this.evalExpr(node2.value, env);
    const t = node2.target;
    const compound = node2.op !== "=";
    const combine = (cur) => this.applyBinary(node2.op[0], cur, rhs, node2.line);
    if (t.type === "Identifier") {
      const value = compound ? combine(env.get(t.name, node2.line)) : rhs;
      env.assign(t.name, value, node2.line);
      return value;
    }
    if (t.type === "Member") {
      const obj = yield* this.evalExpr(t.object, env);
      const value = compound ? combine(this.getMember(obj, t.property, node2.line)) : rhs;
      this.setMember(obj, t.property, value, node2.line);
      return value;
    }
    if (t.type === "Index") {
      const obj = yield* this.evalExpr(t.object, env);
      const idx = yield* this.evalExpr(t.index, env);
      const value = compound ? combine(this.getIndex(obj, idx, node2.line)) : rhs;
      this.setIndex(obj, idx, value, node2.line);
      return value;
    }
    throw this.runtimeError("invalid assignment target", node2.line);
  }
  // ++ / -- : read the target, require a number, write back old±1. Prefix yields
  // the new value; postfix yields the original. The target's object/index sub-
  // expressions are evaluated once.
  *evalUpdate(node2, env) {
    const t = node2.argument;
    const delta = node2.op === "++" ? 1 : -1;
    const verb = node2.op === "++" ? "increment" : "decrement";
    if (t.type === "Identifier") {
      const old = env.get(t.name, node2.line);
      const cur = this.updateNum(old, verb, node2.line);
      env.assign(t.name, cur + delta, node2.line);
      return node2.prefix ? cur + delta : cur;
    }
    if (t.type === "Member") {
      const obj = yield* this.evalExpr(t.object, env);
      const old = this.getMember(obj, t.property, node2.line);
      const cur = this.updateNum(old, verb, node2.line);
      this.setMember(obj, t.property, cur + delta, node2.line);
      return node2.prefix ? cur + delta : cur;
    }
    if (t.type === "Index") {
      const obj = yield* this.evalExpr(t.object, env);
      const idx = yield* this.evalExpr(t.index, env);
      const old = this.getIndex(obj, idx, node2.line);
      const cur = this.updateNum(old, verb, node2.line);
      this.setIndex(obj, idx, cur + delta, node2.line);
      return node2.prefix ? cur + delta : cur;
    }
    throw this.runtimeError("invalid increment/decrement target", node2.line);
  }
  updateNum(v, verb, line) {
    if (typeof v !== "number") {
      throw this.runtimeError(`cannot ${verb} ${typeName(v)}`, line);
    }
    return v;
  }
  // ---- calling ----
  *callValue(fn, args, line) {
    if (fn instanceof NativeFn) {
      const callArgs = fn.raw ? args : args.map((a) => scriptToHost(a));
      let result;
      try {
        result = fn.fn.apply(fn.receiver, callArgs);
      } catch (e) {
        if (e instanceof LangError) throw e;
        throw this.runtimeError(`host function '${fn.name}' threw: ${e.message}`, line);
      }
      return fn.raw ? result : hostToScript(result);
    }
    if (fn instanceof Closure) {
      const scope = fn.env.child();
      for (let i = 0; i < fn.params.length; i++) {
        scope.define(fn.params[i], i < args.length ? args[i] : null);
      }
      this.callStack.push({ name: fn.name || "anonymous", line });
      try {
        yield* this.execStatements(fn.body.body, scope);
      } catch (e) {
        if (e instanceof ReturnSignal) return e.value;
        if (e instanceof LangError && !e.scriptStack) e.scriptStack = this.stackTrace();
        throw e;
      } finally {
        this.callStack.pop();
      }
      return null;
    }
    throw this.runtimeError(`value of type ${typeName(fn)} is not callable`, line);
  }
  bindThis(closure, thisVal) {
    const scope = closure.env.child();
    scope.define("this", thisVal, true);
    const parentClass = closure.homeClass ? closure.homeClass.parent : null;
    scope.vars.set(SUPER, { parentClass, instance: thisVal });
    return new Closure(closure.params, closure.body, scope, closure.name, closure.homeClass);
  }
  superContext(env, line) {
    let ctx = null;
    for (let e = env; e; e = e.parent) {
      if (e.vars.has(SUPER)) {
        ctx = e.vars.get(SUPER);
        break;
      }
    }
    if (!ctx || !ctx.parentClass) {
      throw this.runtimeError("'super' used where there is no superclass", line);
    }
    return ctx;
  }
  // ---- member / index access ----
  getMember(obj, name, line) {
    if (obj instanceof Instance) {
      if (obj.fields.has(name)) return obj.fields.get(name);
      const method = this.findMethod(obj.klass, name);
      if (method) return this.bindThis(method, obj);
      return null;
    }
    if (obj instanceof Map) {
      return obj.has(name) ? obj.get(name) : null;
    }
    if (obj instanceof HostObject) {
      if (Array.isArray(obj.obj)) return this.hostArrayMember(obj, name, line);
      return hostGet(obj, name);
    }
    if (Array.isArray(obj)) return this.arrayMember(obj, name, line);
    if (typeof obj === "string") return this.stringMember(obj, name, line);
    throw this.runtimeError(`cannot read property '${name}' of ${typeName(obj)}`, line);
  }
  setMember(obj, name, value, line) {
    if (obj instanceof Instance) return void obj.fields.set(name, value);
    if (obj instanceof Map) return void obj.set(name, value);
    if (obj instanceof HostObject) return void hostSet(obj, name, value);
    throw this.runtimeError(`cannot set property '${name}' on ${typeName(obj)}`, line);
  }
  getIndex(obj, idx, line) {
    if (Array.isArray(obj)) {
      const i = this.intIndex(idx, line);
      return i >= 0 && i < obj.length ? obj[i] : null;
    }
    if (typeof obj === "string") {
      const i = this.intIndex(idx, line);
      return i >= 0 && i < obj.length ? obj[i] : null;
    }
    if (obj instanceof Map) {
      const key = String(idx);
      return obj.has(key) ? obj.get(key) : null;
    }
    if (obj instanceof HostObject) return hostGet(obj, idx);
    throw this.runtimeError(`cannot index ${typeName(obj)}`, line);
  }
  setIndex(obj, idx, value, line) {
    if (Array.isArray(obj)) {
      const i = this.intIndex(idx, line);
      if (i < 0) throw this.runtimeError("array index cannot be negative", line);
      obj[i] = value;
      return;
    }
    if (obj instanceof Map) {
      obj.set(String(idx), value);
      return;
    }
    if (obj instanceof HostObject) {
      hostSet(obj, idx, value);
      return;
    }
    throw this.runtimeError(`cannot index-assign ${typeName(obj)}`, line);
  }
  intIndex(idx, line) {
    if (typeof idx !== "number" || !Number.isInteger(idx)) {
      throw this.runtimeError(`array/string index must be an integer, got ${typeName(idx)}`, line);
    }
    return idx;
  }
  toIterable(value, line) {
    if (Array.isArray(value)) return value;
    if (typeof value === "string") return value.split("");
    if (value instanceof HostObject && Array.isArray(value.obj)) {
      return value.obj.map((x) => hostToScript(x, value.policy));
    }
    throw this.runtimeError(`cannot iterate over ${typeName(value)}`, line);
  }
  // Fresh per-iteration loop scope carrying `name`'s current value forward, so
  // closures in a `for` body capture that iteration's binding (JS `let`).
  iterEnv(outer, prev, name, isConst) {
    const e = outer.child();
    e.define(name, prev.get(name, null), isConst);
    return e;
  }
  // Built-in array members (returned as raw NativeFns closing over the array).
  arrayMember(arr, name, line) {
    switch (name) {
      case "len":
      case "length":
        return arr.length;
      case "push":
        return new NativeFn((...items) => {
          arr.push(...items);
          return arr.length;
        }, "push", void 0, true);
      case "pop":
        return new NativeFn(() => arr.length ? arr.pop() : null, "pop", void 0, true);
      case "indexOf":
        return new NativeFn((x) => arr.indexOf(x), "indexOf", void 0, true);
      case "includes":
        return new NativeFn((x) => arr.includes(x), "includes", void 0, true);
      case "join":
        return new NativeFn((sep) => arr.map((x) => stringify(x)).join(sep == null ? "," : String(sep)), "join", void 0, true);
      case "slice":
        return new NativeFn((a, b) => arr.slice(a ?? 0, b ?? arr.length), "slice", void 0, true);
      case "sort":
        return new NativeFn((compareFn) => {
          arr.sort(this.sortComparator(compareFn, line, (x) => x));
          return arr;
        }, "sort", void 0, true);
      case "shuffle":
        return new NativeFn(() => shuffleInPlace(arr), "shuffle", void 0, true);
      default: {
        const m = this.arrayCallbackMember(arr, name, line, (x) => x, (a) => a);
        if (m !== void 0) return m;
        throw this.runtimeError(`array has no member '${name}'`, line);
      }
    }
  }
  // Array members for a HOST array (a HostObject wrapping a JS array, e.g. the
  // result of level.findAll/level.objects). Mirrors arrayMember but marshals
  // across the host boundary: values handed to the script (pop/comparator) are
  // wrapped, arguments coming in (push/indexOf) are unwrapped, and in-place
  // mutators return the SAME HostObject so later indexing stays wrapped. Unknown
  // members fall back to hostGet (own props only).
  hostArrayMember(host, name, line) {
    const arr = host.obj;
    const wrap = (x) => hostToScript(x, host.policy);
    switch (name) {
      case "len":
      case "length":
        return arr.length;
      case "push":
        return new NativeFn((...items) => {
          arr.push(...items.map((x) => scriptToHost(x)));
          return arr.length;
        }, "push", void 0, true);
      case "pop":
        return new NativeFn(() => arr.length ? wrap(arr.pop()) : null, "pop", void 0, true);
      case "indexOf":
        return new NativeFn((x) => arr.indexOf(scriptToHost(x)), "indexOf", void 0, true);
      case "includes":
        return new NativeFn((x) => arr.includes(scriptToHost(x)), "includes", void 0, true);
      case "join":
        return new NativeFn(
          (sep) => arr.map((x) => stringify(wrap(x))).join(sep == null ? "," : String(sep)),
          "join",
          void 0,
          true
        );
      case "slice":
        return new NativeFn(
          (a, b) => new HostObject(arr.slice(a ?? 0, b ?? arr.length), host.policy),
          "slice",
          void 0,
          true
        );
      case "sort":
        return new NativeFn((compareFn) => {
          arr.sort(this.sortComparator(compareFn, line, wrap));
          return host;
        }, "sort", void 0, true);
      case "shuffle":
        return new NativeFn(() => {
          shuffleInPlace(arr);
          return host;
        }, "shuffle", void 0, true);
      default: {
        const m = this.arrayCallbackMember(
          arr,
          name,
          line,
          wrap,
          (a) => new HostObject(a, host.policy)
        );
        if (m !== void 0) return m;
        return hostGet(host, name);
      }
    }
  }
  stringMember(str, name, line) {
    switch (name) {
      case "len":
      case "length":
        return str.length;
      case "upper":
        return new NativeFn(() => str.toUpperCase(), "upper", void 0, true);
      case "lower":
        return new NativeFn(() => str.toLowerCase(), "lower", void 0, true);
      case "slice":
        return new NativeFn((a, b) => str.slice(a ?? 0, b ?? str.length), "slice", void 0, true);
      case "indexOf":
        return new NativeFn((x) => str.indexOf(String(x)), "indexOf", void 0, true);
      case "split":
        return new NativeFn((sep) => str.split(sep == null ? "" : String(sep)), "split", void 0, true);
      case "contains":
        return new NativeFn((x) => str.includes(String(x)), "contains", void 0, true);
      default:
        throw this.runtimeError(`string has no member '${name}'`, line);
    }
  }
  // ---- operators ----
  applyBinary(op, l, r, line) {
    switch (op) {
      case "+":
        if (typeof l === "number" && typeof r === "number") return l + r;
        if (typeof l === "string" || typeof r === "string") return stringify(l) + stringify(r);
        throw this.runtimeError(`cannot apply '+' to ${typeName(l)} and ${typeName(r)}`, line);
      case "-":
        return this.num(l, line) - this.num(r, line);
      case "*":
        return this.num(l, line) * this.num(r, line);
      case "/":
        return this.num(l, line) / this.num(r, line);
      case "%":
        return this.num(l, line) % this.num(r, line);
      case "<":
        return this.compare(l, r, line) < 0;
      case "<=":
        return this.compare(l, r, line) <= 0;
      case ">":
        return this.compare(l, r, line) > 0;
      case ">=":
        return this.compare(l, r, line) >= 0;
      case "==":
        return valuesEqual(l, r);
      case "!=":
        return !valuesEqual(l, r);
      case "instanceof":
        return this.isInstanceOf(l, r, line);
      default:
        throw this.runtimeError(`unknown operator '${op}'`, line);
    }
  }
  // `value instanceof klass` — true if `value` is an instance of `klass` or any
  // of its subclasses (walking the ClassValue.parent chain). The right operand
  // must be a class.
  isInstanceOf(value, klass, line) {
    if (!(klass instanceof ClassValue)) {
      throw this.runtimeError(
        `right-hand side of 'instanceof' must be a class, got ${typeName(klass)}`,
        line
      );
    }
    if (!(value instanceof Instance)) return false;
    for (let k = value.klass; k; k = k.parent) {
      if (k === klass) return true;
    }
    return false;
  }
  num(v, line) {
    if (typeof v !== "number") {
      throw this.runtimeError(`expected a number, got ${typeName(v)}`, line);
    }
    return v;
  }
  compare(l, r, line) {
    if (typeof l === "number" && typeof r === "number") return l - r;
    if (typeof l === "string" && typeof r === "string") return l < r ? -1 : l > r ? 1 : 0;
    throw this.runtimeError(`cannot compare ${typeName(l)} and ${typeName(r)}`, line);
  }
};

// src/lexer.js
var KEYWORDS = /* @__PURE__ */ new Set([
  "let",
  "const",
  "function",
  "return",
  "if",
  "else",
  "while",
  "for",
  "break",
  "continue",
  "true",
  "false",
  "null",
  "class",
  "new",
  "this",
  "extends",
  "super",
  "async",
  "await",
  "typeof",
  "instanceof"
]);
var T = {
  NUMBER: "NUMBER",
  STRING: "STRING",
  IDENT: "IDENT",
  KEYWORD: "KEYWORD",
  PUNCT: "PUNCT",
  EOF: "EOF"
};
var OPS2 = ["==", "!=", "<=", ">=", "&&", "||", "+=", "-=", "*=", "/=", "=>", "++", "--"];
var SINGLES = "(){}[],;.+-*/%=<>!?:";
var isDigit = (c) => c >= "0" && c <= "9";
var isIdentStart = (c) => !!c && /[A-Za-z_$]/.test(c);
var isIdentPart = (c) => !!c && /[A-Za-z0-9_$]/.test(c);
function tokenize(source) {
  const tokens = [];
  const n = source.length;
  let i = 0;
  let line = 1;
  let col = 1;
  const peek = (o = 0) => source[i + o];
  const advance = () => {
    const c = source[i++];
    if (c === "\n") {
      line++;
      col = 1;
    } else {
      col++;
    }
    return c;
  };
  while (i < n) {
    const startLine = line;
    const startCol = col;
    const c = peek();
    if (c === " " || c === "	" || c === "\r" || c === "\n") {
      advance();
      continue;
    }
    if (c === "/" && peek(1) === "/") {
      while (i < n && peek() !== "\n") advance();
      continue;
    }
    if (c === "/" && peek(1) === "*") {
      advance();
      advance();
      while (i < n && !(peek() === "*" && peek(1) === "/")) advance();
      if (i >= n) {
        throw new LangError("unterminated block comment", {
          line: startLine,
          column: startCol,
          phase: "lex"
        });
      }
      advance();
      advance();
      continue;
    }
    if (isDigit(c) || c === "." && isDigit(peek(1))) {
      let s = "";
      while (isDigit(peek())) s += advance();
      if (peek() === ".") {
        s += advance();
        while (isDigit(peek())) s += advance();
      }
      if (peek() === "e" || peek() === "E") {
        s += advance();
        if (peek() === "+" || peek() === "-") s += advance();
        while (isDigit(peek())) s += advance();
      }
      tokens.push({ type: T.NUMBER, value: parseFloat(s), line: startLine, column: startCol });
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = advance();
      let s = "";
      while (i < n && peek() !== quote) {
        const ch = advance();
        if (ch === "\n") {
          throw new LangError("unterminated string", {
            line: startLine,
            column: startCol,
            phase: "lex"
          });
        }
        if (ch === "\\") {
          const e = advance();
          switch (e) {
            case "n":
              s += "\n";
              break;
            case "t":
              s += "	";
              break;
            case "r":
              s += "\r";
              break;
            case "\\":
              s += "\\";
              break;
            case '"':
              s += '"';
              break;
            case "'":
              s += "'";
              break;
            case "0":
              s += "\0";
              break;
            default:
              s += e;
          }
        } else {
          s += ch;
        }
      }
      if (i >= n) {
        throw new LangError("unterminated string", {
          line: startLine,
          column: startCol,
          phase: "lex"
        });
      }
      advance();
      tokens.push({ type: T.STRING, value: s, line: startLine, column: startCol });
      continue;
    }
    if (isIdentStart(c)) {
      let s = "";
      while (isIdentPart(peek())) s += advance();
      tokens.push({
        type: KEYWORDS.has(s) ? T.KEYWORD : T.IDENT,
        value: s,
        line: startLine,
        column: startCol
      });
      continue;
    }
    const two = source.slice(i, i + 2);
    if (OPS2.includes(two)) {
      advance();
      advance();
      tokens.push({ type: T.PUNCT, value: two, line: startLine, column: startCol });
      continue;
    }
    if (SINGLES.includes(c)) {
      advance();
      tokens.push({ type: T.PUNCT, value: c, line: startLine, column: startCol });
      continue;
    }
    throw new LangError(`unexpected character '${c}'`, {
      line: startLine,
      column: startCol,
      phase: "lex"
    });
  }
  tokens.push({ type: T.EOF, value: null, line, column: col });
  return tokens;
}

// src/ast.js
function node(type, props = {}) {
  return { type, ...props };
}
var NODE_TYPES = Object.freeze([
  // Statements
  "Program",
  "VarDecl",
  "FunctionDecl",
  "ClassDecl",
  "ReturnStmt",
  "IfStmt",
  "WhileStmt",
  "ForStmt",
  "ForOfStmt",
  "BreakStmt",
  "ContinueStmt",
  "BlockStmt",
  "ExprStmt",
  // Expressions
  "NumberLit",
  "StringLit",
  "BoolLit",
  "NullLit",
  "Identifier",
  "ThisExpr",
  "ArrayLit",
  "ObjectLit",
  "FunctionExpr",
  "Assign",
  "Binary",
  "Logical",
  "Unary",
  "Ternary",
  "Call",
  "NewExpr",
  "Member",
  "Index",
  "SuperExpr",
  "Await",
  "Update"
]);

// src/parser.js
var BINARY_PREC = {
  "||": 1,
  "&&": 2,
  "==": 3,
  "!=": 3,
  "<": 4,
  "<=": 4,
  ">": 4,
  ">=": 4,
  "instanceof": 4,
  "+": 5,
  "-": 5,
  "*": 6,
  "/": 6,
  "%": 6
};
var ASSIGN_OPS = /* @__PURE__ */ new Set(["=", "+=", "-=", "*=", "/="]);
function describe(tok) {
  if (tok.type === T.EOF) return "end of input";
  if (tok.type === T.STRING) return `string ${JSON.stringify(tok.value)}`;
  return `'${tok.value}'`;
}
var Parser = class {
  constructor(tokens) {
    this.tokens = tokens;
    this.pos = 0;
  }
  peek(o = 0) {
    return this.tokens[this.pos + o];
  }
  next() {
    return this.tokens[this.pos++];
  }
  is(type, value) {
    const t = this.peek();
    return t.type === type && (value === void 0 || t.value === value);
  }
  isPunct(v) {
    return this.is(T.PUNCT, v);
  }
  isKw(v) {
    return this.is(T.KEYWORD, v);
  }
  error(msg) {
    const t = this.peek();
    throw new LangError(`${msg} but got ${describe(t)}`, {
      line: t.line,
      column: t.column,
      phase: "parse"
    });
  }
  expectPunct(v) {
    if (!this.isPunct(v)) this.error(`expected '${v}'`);
    return this.next();
  }
  expectIdent() {
    if (!this.is(T.IDENT)) this.error("expected an identifier");
    return this.next();
  }
  // Consume an optional statement-terminating semicolon.
  semi() {
    if (this.isPunct(";")) this.next();
  }
  // ---- Program / statements ----
  parseProgram() {
    const body = [];
    while (!this.is(T.EOF)) body.push(this.parseStatement());
    return node("Program", { body, line: 1 });
  }
  parseStatement() {
    if (this.isKw("let") || this.isKw("const")) return this.parseVarDecl();
    if (this.isKw("function")) return this.parseFunctionDecl();
    if (this.isKw("class")) return this.parseClassDecl();
    if (this.isKw("if")) return this.parseIf();
    if (this.isKw("while")) return this.parseWhile();
    if (this.isKw("for")) return this.parseFor();
    if (this.isKw("return")) return this.parseReturn();
    if (this.isKw("break")) {
      const line2 = this.next().line;
      this.semi();
      return node("BreakStmt", { line: line2 });
    }
    if (this.isKw("continue")) {
      const line2 = this.next().line;
      this.semi();
      return node("ContinueStmt", { line: line2 });
    }
    if (this.isPunct("{")) return this.parseBlock();
    const line = this.peek().line;
    const expression = this.parseExpression();
    this.semi();
    return node("ExprStmt", { expression, line });
  }
  parseVarDecl() {
    const kw = this.next();
    const name = this.expectIdent().value;
    let init = null;
    if (this.isPunct("=")) {
      this.next();
      init = this.parseAssignment();
    } else if (kw.value === "const") {
      this.error("const declaration requires an initializer");
    }
    this.semi();
    return node("VarDecl", { kind: kw.value, name, init, line: kw.line });
  }
  parseFunctionDecl() {
    const line = this.next().line;
    const name = this.expectIdent().value;
    const params = this.parseParams();
    const body = this.parseBlock();
    return node("FunctionDecl", { name, params, body, line });
  }
  parseClassDecl() {
    const line = this.next().line;
    const name = this.expectIdent().value;
    let superClass = null;
    if (this.isKw("extends")) {
      this.next();
      superClass = this.parseCallMember();
    }
    this.expectPunct("{");
    const members = [];
    while (!this.isPunct("}") && !this.is(T.EOF)) {
      const mLine = this.peek().line;
      const mName = this.expectIdent().value;
      const params = this.parseParams();
      const mBody = this.parseBlock();
      members.push({
        name: mName,
        params,
        body: mBody,
        isCtor: mName === "constructor",
        line: mLine
      });
    }
    this.expectPunct("}");
    return node("ClassDecl", { name, superClass, members, line });
  }
  parseIf() {
    const line = this.next().line;
    this.expectPunct("(");
    const test = this.parseExpression();
    this.expectPunct(")");
    const consequent = this.parseStatement();
    let alternate = null;
    if (this.isKw("else")) {
      this.next();
      alternate = this.parseStatement();
    }
    return node("IfStmt", { test, consequent, alternate, line });
  }
  parseWhile() {
    const line = this.next().line;
    this.expectPunct("(");
    const test = this.parseExpression();
    this.expectPunct(")");
    const body = this.parseStatement();
    return node("WhileStmt", { test, body, line });
  }
  parseFor() {
    const line = this.next().line;
    this.expectPunct("(");
    let init = null;
    if (this.isPunct(";")) {
      this.next();
    } else if (this.isKw("let") || this.isKw("const")) {
      const kind = this.next().value;
      const name = this.expectIdent().value;
      if (this.is(T.IDENT, "of")) {
        this.next();
        const iterable = this.parseAssignment();
        this.expectPunct(")");
        const body2 = this.parseStatement();
        return node("ForOfStmt", { kind, name, iterable, body: body2, line });
      }
      let vinit = null;
      if (this.isPunct("=")) {
        this.next();
        vinit = this.parseAssignment();
      }
      init = node("VarDecl", { kind, name, init: vinit, line });
      this.expectPunct(";");
    } else {
      const e = this.parseExpression();
      init = node("ExprStmt", { expression: e, line });
      this.expectPunct(";");
    }
    const test = this.isPunct(";") ? null : this.parseExpression();
    this.expectPunct(";");
    const update = this.isPunct(")") ? null : this.parseExpression();
    this.expectPunct(")");
    const body = this.parseStatement();
    return node("ForStmt", { init, test, update, body, line });
  }
  parseReturn() {
    const line = this.next().line;
    let argument = null;
    if (!this.isPunct(";") && !this.isPunct("}") && !this.is(T.EOF) && this.peek().line === line) {
      argument = this.parseExpression();
    }
    this.semi();
    return node("ReturnStmt", { argument, line });
  }
  parseBlock() {
    const line = this.peek().line;
    this.expectPunct("{");
    const body = [];
    while (!this.isPunct("}") && !this.is(T.EOF)) body.push(this.parseStatement());
    this.expectPunct("}");
    return node("BlockStmt", { body, line });
  }
  parseParams() {
    this.expectPunct("(");
    const params = [];
    if (!this.isPunct(")")) {
      params.push(this.expectIdent().value);
      while (this.isPunct(",")) {
        this.next();
        params.push(this.expectIdent().value);
      }
    }
    this.expectPunct(")");
    return params;
  }
  // ---- Expressions ----
  parseExpression() {
    return this.parseAssignment();
  }
  parseAssignment() {
    const left = this.parseTernary();
    if (this.is(T.PUNCT) && ASSIGN_OPS.has(this.peek().value)) {
      const opTok = this.next();
      if (!["Identifier", "Member", "Index"].includes(left.type)) {
        throw new LangError("invalid assignment target", {
          line: opTok.line,
          column: opTok.column,
          phase: "parse"
        });
      }
      const value = this.parseAssignment();
      return node("Assign", { target: left, op: opTok.value, value, line: opTok.line });
    }
    return left;
  }
  parseTernary() {
    const test = this.parseBinary(1);
    if (this.isPunct("?")) {
      const line = this.next().line;
      const consequent = this.parseAssignment();
      this.expectPunct(":");
      const alternate = this.parseAssignment();
      return node("Ternary", { test, consequent, alternate, line });
    }
    return test;
  }
  parseBinary(minPrec) {
    let left = this.parseUnary();
    while (this.is(T.PUNCT) || this.isKw("instanceof")) {
      const t = this.peek();
      const prec = BINARY_PREC[t.value];
      if (prec === void 0 || prec < minPrec) break;
      this.next();
      const right = this.parseBinary(prec + 1);
      const kind = t.value === "&&" || t.value === "||" ? "Logical" : "Binary";
      left = node(kind, { op: t.value, left, right, line: t.line });
    }
    return left;
  }
  parseUnary() {
    if (this.isKw("await")) {
      const t = this.next();
      const argument = this.parseUnary();
      return node("Await", { argument, line: t.line });
    }
    if (this.isKw("typeof")) {
      const t = this.next();
      const argument = this.parseUnary();
      return node("Unary", { op: "typeof", argument, line: t.line });
    }
    if (this.isPunct("++") || this.isPunct("--")) {
      const op = this.next();
      const argument = this.parseUnary();
      this.checkUpdateTarget(argument, op);
      return node("Update", { op: op.value, prefix: true, argument, line: op.line });
    }
    if (this.isPunct("!") || this.isPunct("-")) {
      const op = this.next();
      const argument = this.parseUnary();
      return node("Unary", { op: op.value, argument, line: op.line });
    }
    return this.parsePostfix();
  }
  // A call/member expression optionally followed by a single postfix ++ / --.
  parsePostfix() {
    let expr = this.parseCallMember();
    if (this.isPunct("++") || this.isPunct("--")) {
      const op = this.next();
      this.checkUpdateTarget(expr, op);
      expr = node("Update", { op: op.value, prefix: false, argument: expr, line: op.line });
    }
    return expr;
  }
  // ++ / -- require an assignable target (variable, member, or index).
  checkUpdateTarget(target, opTok) {
    if (!["Identifier", "Member", "Index"].includes(target.type)) {
      throw new LangError(`'${opTok.value}' requires a variable, property, or index`, {
        line: opTok.line,
        column: opTok.column,
        phase: "parse"
      });
    }
  }
  parseCallMember() {
    let expr = this.parsePrimary();
    while (true) {
      if (this.isPunct("(")) {
        expr = this.finishCall(expr);
      } else if (this.isPunct(".")) {
        const line = this.next().line;
        const property = this.expectIdent().value;
        expr = node("Member", { object: expr, property, line });
      } else if (this.isPunct("[")) {
        const line = this.next().line;
        const index = this.parseExpression();
        this.expectPunct("]");
        expr = node("Index", { object: expr, index, line });
      } else {
        break;
      }
    }
    return expr;
  }
  finishCall(callee) {
    const line = this.peek().line;
    this.expectPunct("(");
    const args = [];
    if (!this.isPunct(")")) {
      args.push(this.parseAssignment());
      while (this.isPunct(",")) {
        this.next();
        args.push(this.parseAssignment());
      }
    }
    this.expectPunct(")");
    return node("Call", { callee, args, line });
  }
  parsePrimary() {
    const t = this.peek();
    if (t.type === T.NUMBER) {
      this.next();
      return node("NumberLit", { value: t.value, line: t.line });
    }
    if (t.type === T.STRING) {
      this.next();
      return node("StringLit", { value: t.value, line: t.line });
    }
    if (t.type === T.KEYWORD) {
      switch (t.value) {
        case "true":
        case "false":
          this.next();
          return node("BoolLit", { value: t.value === "true", line: t.line });
        case "null":
          this.next();
          return node("NullLit", { line: t.line });
        case "this":
          this.next();
          return node("ThisExpr", { line: t.line });
        case "super":
          this.next();
          return node("SuperExpr", { line: t.line });
        case "function":
          return this.parseFunctionExpr();
        case "new":
          return this.parseNew();
        default:
          this.error(`unexpected keyword '${t.value}'`);
      }
    }
    if (t.type === T.IDENT) {
      const nxt = this.peek(1);
      if (nxt && nxt.type === T.PUNCT && nxt.value === "=>") {
        this.next();
        return this.finishArrow([t.value], t.line);
      }
      this.next();
      return node("Identifier", { name: t.value, line: t.line });
    }
    if (this.isPunct("(")) {
      if (this.isArrowParenAhead()) {
        const params = this.parseParams();
        return this.finishArrow(params, t.line);
      }
      this.next();
      const e = this.parseExpression();
      this.expectPunct(")");
      return e;
    }
    if (this.isPunct("[")) return this.parseArrayLit();
    if (this.isPunct("{")) return this.parseObjectLit();
    this.error("unexpected token");
  }
  // Lookahead: at "(", scan to the matching ")" and check for a following "=>".
  isArrowParenAhead() {
    let depth = 0;
    let p = this.pos;
    while (p < this.tokens.length) {
      const t = this.tokens[p];
      if (t.type === T.EOF) return false;
      if (t.type === T.PUNCT && t.value === "(") depth++;
      else if (t.type === T.PUNCT && t.value === ")") {
        depth--;
        if (depth === 0) {
          const after = this.tokens[p + 1];
          return !!after && after.type === T.PUNCT && after.value === "=>";
        }
      }
      p++;
    }
    return false;
  }
  finishArrow(params, line) {
    this.expectPunct("=>");
    let body;
    if (this.isPunct("{")) {
      body = this.parseBlock();
    } else {
      const expr = this.parseAssignment();
      body = node("BlockStmt", {
        body: [node("ReturnStmt", { argument: expr, line })],
        line
      });
    }
    return node("FunctionExpr", { params, body, name: null, line });
  }
  parseFunctionExpr() {
    const line = this.next().line;
    let name = null;
    if (this.is(T.IDENT)) name = this.next().value;
    const params = this.parseParams();
    const body = this.parseBlock();
    return node("FunctionExpr", { params, body, name, line });
  }
  parseNew() {
    const line = this.next().line;
    let callee = this.parsePrimary();
    while (this.isPunct(".")) {
      this.next();
      const property = this.expectIdent().value;
      callee = node("Member", { object: callee, property, line });
    }
    const args = [];
    if (this.isPunct("(")) {
      this.expectPunct("(");
      if (!this.isPunct(")")) {
        args.push(this.parseAssignment());
        while (this.isPunct(",")) {
          this.next();
          args.push(this.parseAssignment());
        }
      }
      this.expectPunct(")");
    }
    return node("NewExpr", { callee, args, line });
  }
  parseArrayLit() {
    const line = this.next().line;
    const elements = [];
    while (!this.isPunct("]") && !this.is(T.EOF)) {
      elements.push(this.parseAssignment());
      if (this.isPunct(",")) this.next();
      else break;
    }
    this.expectPunct("]");
    return node("ArrayLit", { elements, line });
  }
  parseObjectLit() {
    const line = this.next().line;
    const properties = [];
    while (!this.isPunct("}") && !this.is(T.EOF)) {
      const kt = this.peek();
      let key;
      if (kt.type === T.IDENT || kt.type === T.KEYWORD) key = this.next().value;
      else if (kt.type === T.STRING) key = this.next().value;
      else if (kt.type === T.NUMBER) key = String(this.next().value);
      else this.error("expected a property name");
      this.expectPunct(":");
      const value = this.parseAssignment();
      properties.push({ key, value });
      if (this.isPunct(",")) this.next();
      else break;
    }
    this.expectPunct("}");
    return node("ObjectLit", { properties, line });
  }
};
function parse(source) {
  const tokens = tokenize(source);
  try {
    return new Parser(tokens).parseProgram();
  } catch (e) {
    if (e instanceof RangeError) {
      throw new LangError("input nests too deeply", { phase: "parse" });
    }
    throw e;
  }
}

// src/stdlib.js
var CORE_GLOBAL_NAMES = [
  "print",
  "log",
  "len",
  "keys",
  "str",
  "num",
  "bool",
  "range",
  "sleep",
  "waitAll",
  "defer"
];
function lengthOf(x) {
  if (Array.isArray(x) || typeof x === "string") return x.length;
  if (x instanceof Map) return x.size;
  if (x instanceof HostObject) {
    return Array.isArray(x.obj) ? x.obj.length : Object.keys(x.obj).filter((k) => !isPrivateKey(k)).length;
  }
  throw new Error(`len() expects array, string, or object, got ${typeName(x)}`);
}
function keysOf(x) {
  if (x instanceof Map) return [...x.keys()];
  if (x instanceof HostObject && x.obj && typeof x.obj === "object") {
    return Object.keys(x.obj).filter((k) => !isPrivateKey(k));
  }
  throw new Error(`keys() expects an object, got ${typeName(x)}`);
}
function makeRange(a, b, step) {
  let start, end, st;
  if (b === void 0 || b === null) {
    start = 0;
    end = a;
    st = 1;
  } else {
    start = a;
    end = b;
    st = step == null ? 1 : step;
  }
  if (st === 0) throw new Error("range() step cannot be 0");
  const out = [];
  if (st > 0) for (let i = start; i < end; i += st) out.push(i);
  else for (let i = start; i > end; i += st) out.push(i);
  return out;
}
function installCoreGlobals(env, { print } = {}) {
  const out = print || ((s) => console.log(s));
  const def = (name, fn) => env.define(name, new NativeFn(fn, name, void 0, true));
  const printFn = (...args) => {
    out(args.map((a) => stringify(a)).join(" "));
    return null;
  };
  def("print", printFn);
  def("log", printFn);
  def("len", (x) => lengthOf(x));
  def("keys", (x) => keysOf(x));
  def("str", (x) => stringify(x));
  def("num", (x) => {
    const n = typeof x === "number" ? x : Number(x);
    return Number.isNaN(n) ? null : n;
  });
  def("bool", (x) => isTruthy(x));
  def("range", (a, b, step) => makeRange(a, b, step));
  def("sleep", (ms) => new Promise((r) => setTimeout(r, ms == null ? 0 : ms)));
  def("waitAll", (arr) => {
    if (!Array.isArray(arr)) throw new Error(`waitAll() expects an array, got ${typeName(arr)}`);
    return Promise.all(arr.map((x) => Promise.resolve(x)));
  });
  def("defer", () => {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    promise.catch(() => {
    });
    const obj = /* @__PURE__ */ new Map();
    obj.set("promise", promise);
    obj.set("resolve", new NativeFn((v = null) => {
      resolve(v);
      return null;
    }, "resolve", void 0, true));
    obj.set("reject", new NativeFn((e = null) => {
      reject(e instanceof LangError ? e : new LangError(stringify(e), { phase: "runtime" }));
      return null;
    }, "reject", void 0, true));
    return obj;
  });
  return env;
}

// src/debugger.js
var Debugger = class {
  constructor(program, { maxSteps = 1e6 } = {}) {
    this.program = program;
    this.evaluator = program.evaluator;
    this.breakpoints = /* @__PURE__ */ new Set();
    this.maxSteps = maxSteps;
    this.gen = null;
    this.current = null;
    this.done = false;
    this.result = void 0;
  }
  start() {
    this.evaluator.reset({ maxSteps: this.maxSteps, onStep: null });
    this.gen = this.program.generator();
    this.current = null;
    this.done = false;
    this.result = void 0;
    return this;
  }
  addBreakpoint(line) {
    this.breakpoints.add(line);
    return this;
  }
  removeBreakpoint(line) {
    this.breakpoints.delete(line);
    return this;
  }
  // Advance to the next statement. Returns the checkpoint about to execute,
  // or null when the program has finished.
  step() {
    if (this.done) return null;
    if (!this.gen) this.start();
    const res = this.gen.next();
    if (res.done) {
      this.done = true;
      this.result = res.value;
      this.current = null;
      return null;
    }
    if (res.value && res.value.__await) {
      throw new LangError(
        "the debugger does not support stepping across 'await'",
        { line: res.value.line, phase: "runtime" }
      );
    }
    this.current = res.value;
    this.evaluator.stepCheck(this.current);
    return this.current;
  }
  // Run until the next breakpoint line is reached, or the program finishes.
  resume() {
    while (true) {
      const cp = this.step();
      if (cp === null) return null;
      if (this.breakpoints.has(cp.line)) return cp;
    }
  }
  // Run to completion, returning the program's result.
  run() {
    while (this.step() !== null) {
    }
    return this.result;
  }
  get line() {
    return this.current ? this.current.line : null;
  }
  // Local variables visible at the current pause point (innermost scope first),
  // excluding the global/stdlib scope.
  locals() {
    const out = {};
    let env = this.current ? this.current.env : null;
    while (env && env.parent) {
      for (const [k, v] of env.vars) if (!(k in out)) out[k] = v;
      env = env.parent;
    }
    return out;
  }
  // Read a single variable visible at the pause point (null if not found).
  value(name) {
    let env = this.current ? this.current.env : null;
    while (env) {
      if (env.vars.has(name)) return env.vars.get(name);
      env = env.parent;
    }
    return null;
  }
  // Current script call stack (innermost first).
  stack() {
    return this.evaluator.stackTrace();
  }
  // One-line textual snapshot of the pause point.
  describe() {
    if (this.done) return "(finished)";
    const vars = this.locals();
    const varStr = Object.keys(vars).map((k) => `${k}=${stringify(vars[k])}`).join(", ");
    return `line ${this.line} [${this.current.kind}]: {${varStr}}`;
  }
};

// src/editor-support.js
function completionPath(prefix) {
  const tail = (prefix.match(/[\w$.]*$/) || [""])[0];
  const parts = tail.split(".");
  const partial = parts.pop();
  return { path: parts, partial, isMember: tail.includes(".") };
}
function resolvePathValue(root, path) {
  let v = root;
  for (const seg of path) {
    if (v == null || typeof v !== "object") return void 0;
    v = v[seg];
  }
  return v;
}
function describeObject(obj) {
  if (!obj || typeof obj !== "object") return [];
  const docs = obj.__docs__ && typeof obj.__docs__ === "object" ? obj.__docs__ : null;
  return Object.keys(obj).filter((k) => !k.startsWith("__")).map((k) => {
    const v = obj[k];
    const kind = typeof v === "function" ? "function" : v && typeof v === "object" ? "object" : "value";
    return {
      name: k,
      kind,
      arity: typeof v === "function" ? v.length : void 0,
      doc: docs && typeof docs[k] === "string" ? docs[k] : void 0
    };
  });
}
function docFor(root, docsSchema, path, name) {
  const full = [...path, name].join(".");
  if (docsSchema && typeof docsSchema[full] === "string") return docsSchema[full];
  const receiver = resolvePathValue(root, path);
  const conv = receiver && receiver.__docs__;
  if (conv && typeof conv[name] === "string") return conv[name];
  return void 0;
}
function openStringStart(text) {
  let inStr = false, quote = null, start = -1;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], d = text[i + 1];
    if (inStr) {
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === quote) {
        inStr = false;
        quote = null;
      }
    } else if (c === "/" && d === "/") {
      while (i < text.length && text[i] !== "\n") i++;
    } else if (c === "/" && d === "*") {
      i += 2;
      while (i < text.length && !(text[i] === "*" && text[i + 1] === "/")) i++;
      i++;
    } else if (c === '"' || c === "'") {
      inStr = true;
      quote = c;
      start = i;
    }
  }
  return inStr ? start : -1;
}
function callContextAt(text) {
  const strStart = openStringStart(text);
  if (strStart < 0) return null;
  const before = text.slice(0, strStart);
  let depth = 0;
  let argIndex = 0;
  let i = before.length - 1;
  for (; i >= 0; i--) {
    const c = before[i];
    if (c === ")" || c === "]" || c === "}") depth++;
    else if (c === "[" || c === "{") {
      if (depth > 0) depth--;
    } else if (c === "(") {
      if (depth === 0) break;
      depth--;
    } else if (c === "," && depth === 0) {
      argIndex++;
    }
  }
  if (i < 0) return null;
  const calleeMatch = before.slice(0, i).match(/[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/);
  if (!calleeMatch) return null;
  const callee = calleeMatch[0];
  const parts = callee.split(".");
  return {
    callee,
    method: parts[parts.length - 1],
    receiverPath: parts.slice(0, -1),
    argIndex,
    inString: true
  };
}
function enumValuesFor(ctx, { globals = {}, argEnums = {} } = {}) {
  const fromSchema = argEnums[ctx.callee];
  if (fromSchema) {
    if (Array.isArray(fromSchema)) return fromSchema;
    if (fromSchema[ctx.argIndex]) return fromSchema[ctx.argIndex];
  }
  const receiver = resolvePathValue(globals, ctx.receiverPath);
  if (receiver && typeof receiver === "object") {
    const conv = receiver.__argEnums__ && receiver.__argEnums__[ctx.method];
    if (conv) {
      if (Array.isArray(conv)) return conv;
      if (conv[ctx.argIndex]) return conv[ctx.argIndex];
    }
    if (ctx.method === "on" && ctx.argIndex === 0 && Array.isArray(receiver.__events__)) {
      return receiver.__events__;
    }
  }
  return null;
}
function collectScriptSymbols(source) {
  try {
    const ast = parse(source);
    const out = [];
    for (const s of ast.body) {
      if (s.type === "VarDecl") out.push({ name: s.name, kind: "variable" });
      else if (s.type === "FunctionDecl") out.push({ name: s.name, kind: "function" });
      else if (s.type === "ClassDecl") out.push({ name: s.name, kind: "class" });
    }
    return out;
  } catch {
    return [];
  }
}
var ARRAY_MEMBERS = [
  { name: "length", kind: "value" },
  { name: "len", kind: "value" },
  { name: "push", kind: "function", arity: 1 },
  { name: "pop", kind: "function", arity: 0 },
  { name: "indexOf", kind: "function", arity: 1 },
  { name: "includes", kind: "function", arity: 1 },
  { name: "join", kind: "function", arity: 1 },
  { name: "slice", kind: "function", arity: 2 },
  { name: "sort", kind: "function", arity: 1 },
  { name: "shuffle", kind: "function", arity: 0 },
  { name: "filter", kind: "function", arity: 1 },
  { name: "find", kind: "function", arity: 1 },
  { name: "findIndex", kind: "function", arity: 1 },
  { name: "some", kind: "function", arity: 1 },
  { name: "every", kind: "function", arity: 1 },
  { name: "map", kind: "function", arity: 1 }
];
var STRING_MEMBERS = [
  { name: "length", kind: "value" },
  { name: "len", kind: "value" },
  { name: "upper", kind: "function", arity: 0 },
  { name: "lower", kind: "function", arity: 0 },
  { name: "slice", kind: "function", arity: 2 },
  { name: "indexOf", kind: "function", arity: 1 },
  { name: "split", kind: "function", arity: 1 },
  { name: "contains", kind: "function", arity: 1 }
];
function chainPath(node2, locals) {
  const parts = [];
  let n = node2;
  while (n && n.type === "Member") {
    parts.unshift(n.property);
    n = n.object;
  }
  if (!n || n.type !== "Identifier") return null;
  const aliased = locals[n.name];
  if (aliased && aliased.kind === "globalPath") return [...aliased.path, ...parts];
  return [n.name, ...parts];
}
function inferLocalTypes(source) {
  let ast;
  try {
    ast = parse(source);
  } catch {
    return {};
  }
  const locals = {};
  for (const s of ast.body) {
    if (s.type !== "VarDecl" || !s.init) continue;
    const init = s.init;
    if (init.type === "Member" || init.type === "Identifier") {
      const path = chainPath(init, locals);
      if (path) locals[s.name] = { kind: "globalPath", path };
    } else if (init.type === "ArrayLit") {
      locals[s.name] = { kind: "array" };
    } else if (init.type === "StringLit") {
      locals[s.name] = { kind: "string" };
    } else if (init.type === "NewExpr" && init.callee.type === "Identifier") {
      locals[s.name] = { kind: "instance", className: init.callee.name };
    }
  }
  return locals;
}
function classMembers(source, className) {
  let ast;
  try {
    ast = parse(source);
  } catch {
    return [];
  }
  const classes = {};
  for (const s of ast.body) if (s.type === "ClassDecl") classes[s.name] = s;
  const out = [];
  const seen = /* @__PURE__ */ new Set();
  const guard = /* @__PURE__ */ new Set();
  let cls = classes[className];
  while (cls && !guard.has(cls.name)) {
    guard.add(cls.name);
    for (const m of cls.members) {
      if (m.isCtor) {
        for (const stmt of m.body.body) {
          const e = stmt.type === "ExprStmt" ? stmt.expression : null;
          if (e && e.type === "Assign" && e.target.type === "Member" && e.target.object.type === "ThisExpr" && !seen.has(e.target.property)) {
            seen.add(e.target.property);
            out.push({ name: e.target.property, kind: "value" });
          }
        }
      } else if (!seen.has(m.name)) {
        seen.add(m.name);
        out.push({ name: m.name, kind: "function", arity: m.params.length });
      }
    }
    const sup = cls.superClass;
    cls = sup && sup.type === "Identifier" ? classes[sup.name] : null;
  }
  return out;
}
function memberSuggestions(path, { globals = {}, source = "" } = {}) {
  const [root, ...rest] = path;
  const loc = inferLocalTypes(source)[root];
  if (loc) {
    if (loc.kind === "globalPath") {
      return describeObject(resolvePathValue(globals, [...loc.path, ...rest]));
    }
    if (rest.length === 0) {
      if (loc.kind === "array") return ARRAY_MEMBERS;
      if (loc.kind === "string") return STRING_MEMBERS;
      if (loc.kind === "instance") return classMembers(source, loc.className);
    }
    return [];
  }
  return describeObject(resolvePathValue(globals, path));
}
var BUILTINS = CORE_GLOBAL_NAMES;
var KEYWORDS2 = [
  "let",
  "const",
  "function",
  "return",
  "if",
  "else",
  "while",
  "for",
  "break",
  "continue",
  "true",
  "false",
  "null",
  "class",
  "new",
  "this",
  "extends",
  "super",
  "async",
  "await",
  "typeof",
  "instanceof"
];

// src/index.js
var DEFAULT_MAX_STEPS = 1e6;
var Program = class {
  constructor(evaluator, ast, env) {
    this.evaluator = evaluator;
    this.ast = ast;
    this.env = env;
  }
  // Execute the top-level statements. Run once before using call().
  // Returns the result directly for a synchronous script, or a Promise of the
  // result if the script suspends on `await` — so you can always safely write
  // `await program.run()` (awaiting a plain value is a no-op).
  run({ maxSteps = DEFAULT_MAX_STEPS, onStep = null } = {}) {
    this.evaluator.reset({ maxSteps, onStep });
    return this.evaluator.drive(this.evaluator.execProgram(this.ast, this.env));
  }
  // Invoke a function by name, including a dotted path to a method on an object
  // (e.g. "player.attack" or "engine.objects.hero.hurt"). `this` is bound for
  // method calls. Host-space args are marshalled in; the return value comes back.
  // Like run(), returns the value directly or a Promise if the handler awaits.
  call(name, args = [], { maxSteps = DEFAULT_MAX_STEPS, onStep = null } = {}) {
    this.evaluator.reset({ maxSteps, onStep });
    const fn = this.resolvePath(name);
    if (!isCallable(fn)) {
      throw new LangError(`'${name}' is not a function`, { phase: "runtime" });
    }
    const scriptArgs = args.map((a) => hostToScript(a));
    return this.evaluator.drive(this.evaluator.callValue(fn, scriptArgs, null));
  }
  // Call a script function VALUE (e.g. a callback the script handed to a host
  // function via `on(...)`). This is how the host fires stored listeners.
  invoke(fn, args = [], { maxSteps = DEFAULT_MAX_STEPS, onStep = null } = {}) {
    if (!isCallable(fn)) {
      throw new LangError("invoke() expects a function value", { phase: "runtime" });
    }
    this.evaluator.reset({ maxSteps, onStep });
    const scriptArgs = args.map((a) => hostToScript(a));
    return this.evaluator.drive(this.evaluator.callValue(fn, scriptArgs, null));
  }
  // Resolve a name or dotted path to a value, binding `this` along the way.
  resolvePath(path) {
    const parts = String(path).split(".");
    let val = this.env.get(parts[0], null);
    for (let i = 1; i < parts.length; i++) {
      val = this.evaluator.getMember(val, parts[i], null);
    }
    return val;
  }
  // Does a callable of this name/path exist (e.g. an optional event handler)?
  has(name) {
    try {
      return isCallable(this.resolvePath(name));
    } catch {
      return false;
    }
  }
  // Low-level generator over top-level execution, for the Debugger.
  generator() {
    return this.evaluator.execProgram(this.ast, this.env);
  }
};
var Interpreter = class {
  constructor({ stdlib = true, modules = null, print = null } = {}) {
    this.globals = new Environment();
    this.evaluator = new Evaluator();
    if (stdlib) installCoreGlobals(this.globals, { print });
    if (modules) this.installModules(modules);
  }
  // Install namespaced stdlib modules — plain JS objects whose members are the
  // namespace's functions/values (e.g. { Math, Easing }). Read-only by default so
  // scripts can't clobber Math.floor; pass { writable, extensible } to relax.
  installModules(modules, options = { writable: false, extensible: false }) {
    defineGlobals(this.globals, modules, options);
    return this;
  }
  // options: { writable, extensible } control whether scripts may modify or add
  // keys to a registered host object (defaults: both true). An optional `fields`
  // map { key: { writable?, extensible?, fields? } } narrows the policy per
  // key/subtree (omitted flags inherit from the parent).
  defineGlobal(name, value, options = {}) {
    defineGlobal(this.globals, name, value, options);
    return this;
  }
  defineGlobals(obj, options = {}) {
    defineGlobals(this.globals, obj, options);
    return this;
  }
  // Parse source into a reusable Program with its own top-level scope.
  compile(source) {
    const ast = parse(source);
    return new Program(this.evaluator, ast, this.globals.child());
  }
  // Convenience: compile + run in one call.
  run(source, opts) {
    return this.compile(source).run(opts);
  }
};
export {
  ARRAY_MEMBERS,
  BUILTINS,
  CORE_GLOBAL_NAMES,
  Debugger,
  Interpreter,
  KEYWORDS2 as KEYWORDS,
  LangError,
  Program,
  STRING_MEMBERS,
  callContextAt,
  classMembers,
  collectScriptSymbols,
  completionPath,
  describeObject,
  docFor,
  enumValuesFor,
  hostToScript,
  inferLocalTypes,
  installCoreGlobals,
  memberSuggestions,
  openStringStart,
  parse,
  resolvePathValue,
  scriptToHost,
  stringify,
  tokenize,
  typeName
};
