// Parsing and planning for the one-off import of the Worker's D1 `users`
// table (from `wrangler d1 export`). Pure functions, no database access.

const LEGACY_HASH_PATTERN = /^[0-9a-f]{64}$/;
const DEFAULT_COLUMNS = ["uuid", "username", "password", "premium"];

function unquoteIdentifier(identifier) {
  return identifier.trim().replace(/^["'`[]|["'`\]]$/g, "");
}

function skipWhitespace(sql, index) {
  while (index < sql.length && /\s/.test(sql[index])) index += 1;
  return index;
}

// Reads one SQL literal starting at `index`: a quoted string ('' escapes a
// quote), NULL, or a bare number/keyword.
function readValue(sql, index) {
  if (sql[index] === "'") {
    let value = "";
    index += 1;
    while (index < sql.length) {
      if (sql[index] === "'") {
        if (sql[index + 1] === "'") {
          value += "'";
          index += 2;
          continue;
        }
        return { value, index: index + 1 };
      }
      value += sql[index];
      index += 1;
    }
    throw new Error("Unterminated string in D1 export");
  }

  const start = index;
  while (index < sql.length && !/[,)\s]/.test(sql[index])) index += 1;
  const raw = sql.slice(start, index);
  if (/^null$/i.test(raw)) return { value: null, index };
  if (/^-?\d+(\.\d+)?$/.test(raw)) return { value: Number(raw), index };
  return { value: raw, index };
}

function readTuple(sql, index) {
  const values = [];
  index = skipWhitespace(sql, index + 1);
  while (sql[index] !== ")") {
    const result = readValue(sql, index);
    values.push(result.value);
    index = skipWhitespace(sql, result.index);
    if (sql[index] === ",") index = skipWhitespace(sql, index + 1);
    else if (sql[index] !== ")") {
      throw new Error(`Unexpected character in D1 export at offset ${index}`);
    }
  }
  return { values, index: index + 1 };
}

function readCreateTableColumns(sql) {
  const match =
    /CREATE TABLE\s+(?:IF NOT EXISTS\s+)?["'`[]?users["'`\]]?\s*\(/i.exec(sql);
  if (!match) return null;

  // Walk to the matching close paren so types like VARCHAR(16) don't end it.
  let depth = 1;
  let index = match.index + match[0].length;
  const start = index;
  while (index < sql.length && depth > 0) {
    if (sql[index] === "(") depth += 1;
    if (sql[index] === ")") depth -= 1;
    index += 1;
  }

  const definitions = [];
  let current = "";
  depth = 0;
  for (const char of sql.slice(start, index - 1)) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    if (char === "," && depth === 0) {
      definitions.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  definitions.push(current);

  return definitions
    .map((definition) => definition.trim())
    .filter(
      (definition) =>
        definition &&
        !/^(PRIMARY KEY|UNIQUE|CHECK|FOREIGN KEY|CONSTRAINT)\b/i.test(
          definition,
        ),
    )
    .map((definition) => unquoteIdentifier(definition.split(/\s+/)[0]));
}

function toPremium(value) {
  if (typeof value === "string") {
    return value === "1" || value.toLowerCase() === "true";
  }
  return Boolean(value);
}

// Returns one { uuid, username, password, premium } per row inserted into
// `users`, whatever the column order or extra columns in the export.
export function parseUsersExport(sql) {
  const tableColumns = readCreateTableColumns(sql) || DEFAULT_COLUMNS;
  const insertPattern = /INSERT INTO\s+["'`[]?users["'`\]]?\s*/gi;
  const rows = [];

  let match;
  while ((match = insertPattern.exec(sql))) {
    let index = match.index + match[0].length;
    let columns = tableColumns;

    if (sql[index] === "(") {
      const end = sql.indexOf(")", index);
      columns = sql
        .slice(index + 1, end)
        .split(",")
        .map(unquoteIdentifier);
      index = skipWhitespace(sql, end + 1);
    }

    if (!/^VALUES/i.test(sql.slice(index, index + 6))) continue;
    index = skipWhitespace(sql, index + 6);

    while (sql[index] === "(") {
      const tuple = readTuple(sql, index);
      if (tuple.values.length !== columns.length) {
        throw new Error(
          `users row has ${tuple.values.length} values but ${columns.length} columns`,
        );
      }

      const record = Object.fromEntries(
        columns.map((column, position) => [column, tuple.values[position]]),
      );
      rows.push({
        uuid: record.uuid == null ? "" : String(record.uuid),
        username: record.username == null ? "" : String(record.username),
        password: record.password == null ? "" : String(record.password),
        premium: toPremium(record.premium),
      });

      index = skipWhitespace(sql, tuple.index);
      if (sql[index] === ",") index = skipWhitespace(sql, index + 1);
    }

    insertPattern.lastIndex = index;
  }

  return rows;
}

function collectDuplicates(rows, key) {
  const counts = new Map();
  for (const row of rows) {
    counts.set(row[key], (counts.get(row[key]) || 0) + 1);
  }
  return [...counts].filter(([, count]) => count > 1).map(([value]) => value);
}

export function findDuplicates(rows) {
  return {
    uuids: collectDuplicates(rows, "uuid"),
    usernames: collectDuplicates(rows, "username"),
  };
}

// Decides what to do with each exported row given what Postgres already
// holds (`existing`: uuid -> { username, premium }). Existing rows keep
// their password: the Worker had no way to change one, and skipping the
// re-hash is what makes a second import fast.
export function planUserImport(rows, existing = new Map()) {
  const plan = { toInsert: [], toUpdate: [], unchanged: 0, skipped: [] };

  for (const row of rows) {
    if (!row.uuid || !row.username) {
      plan.skipped.push({ row, reason: "missing uuid or username" });
      continue;
    }

    const current = existing.get(row.uuid);
    if (current) {
      if (
        current.username !== row.username ||
        Boolean(current.premium) !== row.premium
      ) {
        plan.toUpdate.push({
          uuid: row.uuid,
          username: row.username,
          premium: row.premium,
        });
      } else {
        plan.unchanged += 1;
      }
      continue;
    }

    if (!LEGACY_HASH_PATTERN.test(row.password)) {
      plan.skipped.push({ row, reason: "password is not a SHA-256 hex hash" });
      continue;
    }

    plan.toInsert.push(row);
  }

  return plan;
}
