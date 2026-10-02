import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { readNdjsonLines } from "../scripts/lib/ndjson.js";

async function readAll(contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ndjson-test-"));
  const file = path.join(dir, "data.ndjson");
  fs.writeFileSync(file, contents);

  try {
    const lines = [];
    for await (const line of readNdjsonLines(file)) lines.push(line);
    return lines;
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test("keeps Unicode line separators and carriage returns inside a record", async () => {
  const records = [
    { uuid: "a", saveData: JSON.stringify({ text: "one two three" }) },
    { uuid: "b", saveData: "raw\rcarriage ✓" },
  ];
  const contents = records.map((record) => JSON.stringify(record)).join("\n");

  const lines = await readAll(`${contents}\n`);

  assert.deepEqual(lines.map(JSON.parse), records);
});

test("handles lines larger than a stream chunk and a missing final newline", async () => {
  const big = "x".repeat(300_000) + "é";
  const contents = `${JSON.stringify({ big })}\n\n${JSON.stringify({ last: 1 })}`;

  const lines = await readAll(contents);

  assert.equal(lines.length, 2);
  assert.equal(JSON.parse(lines[0]).big, big);
  assert.deepEqual(JSON.parse(lines[1]), { last: 1 });
});
