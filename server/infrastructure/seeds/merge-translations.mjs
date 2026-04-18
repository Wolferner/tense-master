// Usage: node merge-translations.mjs <file.json> <translation-output.tsv>
// Example: node merge-translations.mjs data/past-simple.json translation-output.tsv
//
// TSV from Claude must be: INDEX<TAB>fr_q<TAB>fr_e<TAB>de_q<TAB>de_e<TAB>es_q<TAB>es_e

import { readFileSync, writeFileSync } from "fs";

const [, , filePath, tsvPath] = process.argv;

if (!filePath || !tsvPath) {
  console.error("Usage: node merge-translations.mjs <file.json> <translation-output.tsv>");
  process.exit(1);
}

const data = JSON.parse(readFileSync(filePath, "utf-8"));
const tsv = readFileSync(tsvPath, "utf-8");

let updated = 0;
let errors = 0;

for (const line of tsv.trim().split("\n")) {
  const parts = line.split("\t");
  if (parts.length !== 7) {
    console.warn(`Skipping malformed line: ${line.slice(0, 60)}`);
    errors++;
    continue;
  }

  const [indexStr, fr_q, fr_e, de_q, de_e, es_q, es_e] = parts;
  const index = parseInt(indexStr);

  if (isNaN(index) || !data.exercises[index]) {
    console.warn(`Unknown index: ${indexStr}`);
    errors++;
    continue;
  }

  data.exercises[index].translations.fr = { question: fr_q.trim(), explanation: fr_e.trim() };
  data.exercises[index].translations.de = { question: de_q.trim(), explanation: de_e.trim() };
  data.exercises[index].translations.es = { question: es_q.trim(), explanation: es_e.trim() };
  updated++;
}

writeFileSync(filePath, JSON.stringify(data, null, "\t"), "utf-8");
console.log(`Done: ${updated} updated, ${errors} errors. File saved: ${filePath}`);
