import { $ } from "bun";

import pkg from "../../package.json";

/**
 * Build the library.
 */
const build = async () => {
  await $`rm -rf build`;

  // Keep peer/runtime dependencies out of the bundle so consumers dedupe them.
  const external = [
    ...Object.keys(pkg.peerDependencies ?? {}),
    ...Object.keys(pkg.dependencies ?? {}),
    // Subpath imports (e.g. @lexical/react/LexicalComposer)
    "@lexical/*",
    "@hocuspocus/*",
    "react/*",
    "react-dom/*",
  ];

  console.log("📦 Bundling...");
  await Bun.build({
    entrypoints: ["src/index.ts"],
    outdir: "build",
    target: "browser",
    external,
  });
  console.log("📦 Bundling complete.\n");

  console.log("📘 Generating type declarations...");
  await $`bunx tsc --noEmit false --declaration --emitDeclarationOnly --outDir build`;
  console.log("📘 Type declarations generated.");
};

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
