// Joke entry for the-joke-about-the-demo-20261123-0112.
// Node 22, standard library only, no network.
//
// The joke itself lives in entry.txt beside this file. The program copies
// that file, unchanged, into the directory the grader hands it:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// When MAKEFUN_OUTPUT_DIR is not set, the copy lands in /output/entry.txt.

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = fileURLToPath(new URL('.', import.meta.url));

/** Pick the output directory: the env var when it is set and non-empty. */
function targetDir(): string {
  const given = process.env.MAKEFUN_OUTPUT_DIR;
  if (given !== undefined && given.trim() !== '') return given;
  return '/output';
}

const jokeFile = join(scriptDir, 'entry.txt');
if (!existsSync(jokeFile)) {
  process.stderr.write(`joke: entry.txt is missing next to main.ts\n`);
  process.exit(1);
}

const dest = targetDir();
mkdirSync(dest, { recursive: true });
const destFile = join(dest, 'entry.txt');
copyFileSync(jokeFile, destFile);

// Confirm the copy landed whole: the destination must be the same size
// as the source, or the entry the grader reads would be wrong.
if (statSync(destFile).size !== statSync(jokeFile).size) {
  process.stderr.write(`joke: copy to ${destFile} came out the wrong size\n`);
  process.exit(1);
}
process.stdout.write(`joke: wrote entry.txt to ${dest}\n`);
