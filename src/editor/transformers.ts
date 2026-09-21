import { TRANSFORMERS as LEXICAL_TRANSFORMERS } from "@lexical/markdown";

import { $createImageNode, $isImageNode, ImageNode } from "./plugins/ImageNode";

import type { TextMatchTransformer } from "@lexical/markdown";

/** Markdown transformer for `![alt](src)` image syntax */
const IMAGE_TRANSFORMER: TextMatchTransformer = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node)) return null;
    return node.getTextContent();
  },
  importRegExp: /!\[([^\]]*)\]\(([^)]+)\)/,
  regExp: /!\[([^\]]*)\]\(([^)]+)\)/,
  replace: (textNode, match) => {
    const [, alt, src] = match;
    const imageNode = $createImageNode(src ?? "", alt ?? "");
    textNode.replace(imageNode);
  },
  trigger: ")",
  type: "text-match",
};

/** Combined transformers including image support */
const TRANSFORMERS = [...LEXICAL_TRANSFORMERS, IMAGE_TRANSFORMER];

export { IMAGE_TRANSFORMER, TRANSFORMERS };
