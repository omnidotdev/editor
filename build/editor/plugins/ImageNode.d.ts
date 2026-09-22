import { DecoratorNode } from "lexical";
import type { EditorConfig, NodeKey, SerializedLexicalNode, Spread } from "lexical";
import type { JSX } from "react";
type SerializedImageNode = Spread<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
}, SerializedLexicalNode>;
/** Block-level image node for embedded assets */
export declare class ImageNode extends DecoratorNode<JSX.Element> {
    __src: string;
    __alt: string;
    __width?: number;
    __height?: number;
    static getType(): string;
    static clone(node: ImageNode): ImageNode;
    constructor(src: string, alt: string, width?: number, height?: number, key?: NodeKey);
    createDOM(_config: EditorConfig): HTMLElement;
    updateDOM(): boolean;
    static importJSON(json: SerializedImageNode): ImageNode;
    exportJSON(): SerializedImageNode;
    getTextContent(): string;
    isInline(): boolean;
    decorate(): JSX.Element;
}
export declare function $createImageNode(src: string, alt: string, width?: number, height?: number): ImageNode;
/** Type guard for `ImageNode` */
export declare function $isImageNode(node: import("lexical").LexicalNode | null | undefined): node is ImageNode;
export {};
//# sourceMappingURL=ImageNode.d.ts.map