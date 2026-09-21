import { CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";

import { cn } from "./cn";
import { ImageNode } from "./plugins/ImageNode";
import { LocalContentPlugin } from "./plugins/LocalContentPlugin";
import { TRANSFORMERS } from "./transformers";

import type { HocuspocusProvider } from "@hocuspocus/provider";
import type { Provider } from "@lexical/yjs";
import type { EditorThemeClasses, Klass, LexicalNode } from "lexical";
import type { JSX, ReactNode } from "react";
import type { Doc } from "yjs";

/**
 * Base nodes every editor instance registers. Consumers append their own
 * (wikilinks, transclusions, custom decorators) via the `nodes` prop.
 */
const BASE_NODES: Array<Klass<LexicalNode>> = [
  HeadingNode,
  QuoteNode,
  ListNode,
  ListItemNode,
  LinkNode,
  AutoLinkNode,
  CodeNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HorizontalRuleNode,
  ImageNode,
];

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

const defaultOnError = (error: Error) => {
  console.error("Lexical error:", error);
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
export const EditorCore = ({
  documentId,
  namespace = "OmniEditor",
  theme = {},
  nodes,
  plugins,
  className,
  contentEditableClassName,
  placeholder = null,
  ariaPlaceholder,
  onError = defaultOnError,
  ydoc,
  provider,
  username,
  cursorColor,
  initialContent,
  onContentChange,
}: EditorCoreProps) => {
  const initialConfig = {
    namespace,
    theme,
    nodes: [...BASE_NODES, ...(nodes ?? [])],
    onError,
    // Must be null when using CollaborationPlugin or LocalContentPlugin
    editorState: null,
  };

  const isCollab = Boolean(provider && ydoc);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={cn("relative", className)}>
        <RichTextPlugin
          contentEditable={
            placeholder ? (
              <ContentEditable
                className={contentEditableClassName}
                aria-placeholder={ariaPlaceholder ?? ""}
                placeholder={placeholder}
              />
            ) : (
              <ContentEditable className={contentEditableClassName} />
            )
          }
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />

        {isCollab && ydoc && provider ? (
          <CollaborationPlugin
            id={documentId ?? namespace}
            providerFactory={(id, yjsDocMap) => {
              yjsDocMap.set(id, ydoc);
              return provider as unknown as Provider;
            }}
            shouldBootstrap={false}
            username={username}
            cursorColor={cursorColor}
          />
        ) : initialContent !== undefined && onContentChange ? (
          <LocalContentPlugin
            initialContent={initialContent}
            onContentChange={onContentChange}
          />
        ) : null}

        <ListPlugin />
        <LinkPlugin />
        <CheckListPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <HorizontalRulePlugin />

        {plugins}
      </div>
    </LexicalComposer>
  );
};
