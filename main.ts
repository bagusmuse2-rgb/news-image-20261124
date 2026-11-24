import { copyFileSync, existsSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Entry for make.fun bounty "news-image-20261124".
// One image summing up the world news of Tuesday 24 November 2026.
// This program copies the pre-rendered entry.png next to this file into
// the harness output directory. No network, no randomness: the same
// input bytes always produce the same output bytes.

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.png");
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

if (!existsSync(source)) {
  console.error(`entry.png not found next to main.ts: ${source}`);
  process.exit(1);
}

mkdirSync(outDir, { recursive: true });
const dest = join(outDir, "entry.png");
copyFileSync(source, dest);

// Sanity check: the copied file must be byte-identical in size to the source,
// and must stay inside the 1 MiB limit the bounty requires.
const srcSize = statSync(source).size;
const dstSize = statSync(dest).size;
if (srcSize !== dstSize) {
  console.error(`size mismatch after copy: source ${srcSize} vs output ${dstSize}`);
  process.exit(1);
}
if (dstSize > 1024 * 1024) {
  console.error(`entry.png is ${dstSize} bytes, over the 1 MiB limit`);
  process.exit(1);
}
console.log(`Wrote ${dest} (${dstSize} bytes)`);
