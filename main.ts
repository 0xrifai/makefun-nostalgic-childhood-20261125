// Make the AI Judge Feel Nostalgic: A Childhood Memory.
//
// Writes one sentence — a childhood memory of fogging a car window with
// warm breath and drawing a little house that fades before the drive
// ends — to the absolute path /output/entry.txt.
//
// The grader mounts this repository read-only, so the output must go to
// the absolute /output directory, never to a relative output/ folder
// inside the repo. Nothing is read from the network, the environment,
// or anywhere outside this repository.

import { mkdirSync, writeFileSync } from "node:fs";

// ---------------------------------------------------------------------------
// The entry
// ---------------------------------------------------------------------------

const SENTENCE =
  "I pressed my forehead to the car window on the long drive home, " +
  "fogging the glass with my breath, and drew a little house there " +
  "that faded before we reached our street.";

// The bounty gate: /output/entry.txt must be UTF-8 text of 1-280
// characters, not only whitespace, and a single clean sentence.
const OUTPUT_DIR = "/output";
const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 280;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Count characters the way the gate does: one per Unicode code point. */
function countChars(text: string): number {
  return [...text].length;
}

/** True when the text is exactly one sentence: a single terminal mark. */
function isSingleSentence(text: string): boolean {
  const trimmed = text.trim();
  const terminators = trimmed.match(/[.!?]/g) ?? [];
  return terminators.length === 1 && /[.!?]$/.test(trimmed);
}

/** Check the sentence against every rule the sealed gate enforces. */
function validateEntry(text: string): string[] {
  const problems: string[] = [];
  const length = countChars(text);
  if (text.trim().length === 0) {
    problems.push("entry is only whitespace");
  }
  if (length < MIN_CHARS || length > MAX_CHARS) {
    problems.push(
      `entry is ${length} characters, outside the ${MIN_CHARS}-${MAX_CHARS} range`,
    );
  }
  if (!isSingleSentence(text)) {
    problems.push("entry is not exactly one sentence");
  }
  return problems;
}

/** Make sure the absolute output directory exists before writing. */
function ensureOutputDir(): void {
  mkdirSync(OUTPUT_DIR, { recursive: true });
}

/** Write the validated sentence to the absolute output path. */
function writeEntry(text: string): void {
  const problems = validateEntry(text);
  if (problems.length > 0) {
    throw new Error(`Invalid entry: ${problems.join("; ")}`);
  }
  ensureOutputDir();
  writeFileSync(OUTPUT_PATH, text, "utf8");
}

/** One-line summary of the entry for the run log: words and characters. */
function describeEntry(text: string): string {
  const words = text.trim().split(/\s+/).length;
  return `${words} words, ${countChars(text)} characters, one sentence`;
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------

function main(): void {
  writeEntry(SENTENCE);
  console.log(`Wrote ${countChars(SENTENCE)} characters to ${OUTPUT_PATH}`);
  console.log(`Entry: ${describeEntry(SENTENCE)}`);
}

main();
