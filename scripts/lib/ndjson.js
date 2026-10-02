import fs from "node:fs";

const NEWLINE = 0x0a;

// Yields each line of a newline-delimited JSON file as a string. Splits on
// "\n" bytes only: node:readline also breaks on U+2028/U+2029, which
// JSON.stringify leaves unescaped, so it would cut a save in half.
export async function* readNdjsonLines(file) {
  let pending = [];

  for await (const chunk of fs.createReadStream(file)) {
    let start = 0;
    let end;
    while ((end = chunk.indexOf(NEWLINE, start)) !== -1) {
      pending.push(chunk.subarray(start, end));
      const line = Buffer.concat(pending).toString("utf8");
      pending = [];
      start = end + 1;
      if (line) yield line;
    }
    if (start < chunk.length) pending.push(chunk.subarray(start));
  }

  const last = Buffer.concat(pending).toString("utf8");
  if (last) yield last;
}
