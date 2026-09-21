import { $applyNodeReplacement, DecoratorNode } from "lexical";

import type {
  EditorConfig,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import type { JSX } from "react";

type SerializedImageNode = Spread<
  {
    src: string;
    alt: string;
    width?: number;
    height?: number;
  },
  SerializedLexicalNode
>;

/** Block-level image node for embedded assets */
export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __alt: string;
  __width?: number;
  __height?: number;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__alt,
      node.__width,
      node.__height,
      node.__key,
    );
  }

  constructor(
    src: string,
    alt: string,
    width?: number,
    height?: number,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const div = document.createElement("div");
    div.className = "my-2";
    return div;
  }

  updateDOM(): boolean {
    return false;
  }

  static importJSON(json: SerializedImageNode): ImageNode {
    return $createImageNode(json.src, json.alt, json.width, json.height);
  }

  exportJSON(): SerializedImageNode {
    return {
      ...super.exportJSON(),
      type: "image",
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
    };
  }

  getTextContent(): string {
    return `![${this.__alt}](${this.__src})`;
  }

  isInline(): boolean {
    return false;
  }

  decorate(): JSX.Element {
    return (
      <figure>
        <img
          src={this.__src}
          alt={this.__alt}
          width={this.__width}
          height={this.__height}
          loading="lazy"
          className="max-w-full rounded-lg"
        />
        {this.__alt && (
          <figcaption className="mt-1 text-center text-muted-foreground text-sm">
            {this.__alt}
          </figcaption>
        )}
      </figure>
    );
  }
}

export function $createImageNode(
  src: string,
  alt: string,
  width?: number,
  height?: number,
): ImageNode {
  return $applyNodeReplacement(new ImageNode(src, alt, width, height));
}

/** Type guard for `ImageNode` */
export function $isImageNode(
  node: import("lexical").LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
