import { $ } from "bun";

import pkg from "../../package.json";

/**
 * Build the library.
 */
const build = async () => {
  // Build with the PRODUCTION automatic JSX runtime. Without this, Bun emits the
  // development runtime (literal jsxDEV calls + a react/jsx-dev-runtime import),
  // which throws "jsxDEV is not a function" in any consumer's production bundle
  // (React's prod jsx-dev-runtime leaves jsxDEV undefined), taking down every
  // view that renders this editor. Setting NODE_ENV flips Bun to jsx/jsxs
  process.env.NODE_ENV = "production";

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
    // Belt-and-suspenders with NODE_ENV above: pin the prod runtime selection
    define: { "process.env.NODE_ENV": JSON.stringify("production") },
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
