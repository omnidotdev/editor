import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { EditorThemeClasses, Klass, LexicalNode } from "lexical";
import type { JSX, ReactNode } from "react";
import type { Doc } from "yjs";
type EditorCoreProps = {
    /** Stable document identifier, also used as the collaboration room id */
    documentId?: string;
    /** Lexical namespace @default "OmniEditor" */
    namespace?: string;
    /** Lexical theme class map @default {} */
    theme?: EditorThemeClasses;
    /** Extra nodes appended to the base node set */
    nodes?: Array<Klass<LexicalNode>>;
    /** Extra plugins rendered as children (e.g. wikilinks, slash commands) */
    plugins?: ReactNode;
    /** Class applied to the editor wrapper */
    className?: string;
    /** Class applied to the contenteditable surface */
    contentEditableClassName?: string;
    /**
     * Wrap the editable surface (e.g. in a context menu). Receives the default
     * ContentEditable element and must return a single element containing it.
     */
    renderContentEditable?: (editable: JSX.Element) => JSX.Element;
    /** Placeholder element shown when empty */
    placeholder?: JSX.Element | null;
    /** Accessible placeholder text */
    ariaPlaceholder?: string;
    /** Error handler @default console.error */
    onError?: (error: Error) => void;
    /** Y.Doc for collaborative mode */
    ydoc?: Doc;
    /** Hocuspocus provider for collaborative mode */
    provider?: HocuspocusProvider | null;
    /** Local user display name for presence/cursors */
    username?: string;
    /** Local user cursor color for presence */
    cursorColor?: string;
    /** Initial markdown for local mode (mutually exclusive with ydoc/provider) */
    initialContent?: string;
    /** Called on content change in local mode */
    onContentChange?: (markdown: string) => void;
};
/**
 * Headless, product-agnostic collaborative rich-text editor.
 *
 * Ships a base node set and the core rich-text plugins (rich text, lists,
 * links, checklists, markdown shortcuts, horizontal rule). When a `provider`
 * and `ydoc` are supplied it runs in collaborative mode via the Lexical
 * collaboration plugin, otherwise it runs local-first from `initialContent`.
 * Everything product-specific (wikilinks, transclusions, image storage) is
 * injected through the `nodes` and `plugins` props.
 */
export declare const EditorCore: ({ documentId, namespace, theme, nodes, plugins, className, contentEditableClassName, renderContentEditable, placeholder, ariaPlaceholder, onError, ydoc, provider, username, cursorColor, initialContent, onContentChange, }: EditorCoreProps) => JSX.Element;
export {};
//# sourceMappingURL=EditorCore.d.ts.map