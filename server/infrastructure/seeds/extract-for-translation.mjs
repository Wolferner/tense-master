// Usage: node extract-for-translation.mjs <file.json> [batchSize]
// Example: node extract-for-translation.mjs data/past-simple.json 50
//
// Outputs compact TSV: index<TAB>question<TAB>explanation
// Paste into Claude with the prompt below.

import { readFileSync, writeFileSync } from "fs";

const [, , filePath, batchSizeArg] = process.argv;

if (!filePath) {
  console.error("Usage: node extract-for-translation.mjs <file.json> [batchSize]");
  process.exit(1);
}

const data = JSON.parse(readFileSync(filePath, "utf-8"));
const exercises = data.exercises;
const batchSize = parseInt(batchSizeArg) || exercises.length;

const lines = exercises.map((ex, i) => {
  const ru = ex.translations?.ru;
  if (!ru) return null;
  return `${i}\t${ru.question}\t${ru.explanation}`;
}).filter(Boolean);

const batches = [];
for (let i = 0; i < lines.length; i += batchSize) {
  batches.push(lines.slice(i, i + batchSize));
}

batches.forEach((batch, bi) => {
  const outFile = batches.length === 1
    ? `translation-input.tsv`
    : `translation-input-batch${bi + 1}.tsv`;
  writeFileSync(outFile, batch.join("\n"), "utf-8");
  console.log(`Wrote ${outFile} (${batch.length} exercises)`);
});

console.log(`
--- CLAUDE PROMPT (paste after the TSV content) ---
Translate each row from Russian to French, German, and Spanish.
Format: INDEX<TAB>fr_question<TAB>fr_explanation<TAB>de_question<TAB>de_explanation<TAB>es_question<TAB>es_explanation
Keep the same INDEX. Do not add any other text, only the rows.
`);
