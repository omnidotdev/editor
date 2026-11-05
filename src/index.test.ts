import { expect, test } from "bun:test";

import * as editor from "./index";

// Smoke test: guard the public API surface so a broken or dropped export
// fails CI instead of silently reaching consumers (which install this as a
// git dependency and cannot rely on an npm publish step to catch it)
test("public API exposes the expected exports", () => {
  const expected = [
    "EditorCore",
    "LocalContentPlugin",
    "MobileToolbar",
    "ImageNode",
    "$createImageNode",
    "$isImageNode",
    "TRANSFORMERS",
    "IMAGE_TRANSFORMER",
    "createProvider",
    "createPersistence",
    "getOrCreateDoc",
    "hasDoc",
    "destroyDoc",
    "useCollaboration",
  ] as const;

  for (const name of expected) {
    expect(editor).toHaveProperty(name);
    expect(editor[name as keyof typeof editor]).toBeDefined();
  }
});
