// src/collaboration/createPersistence.ts
import { IndexeddbPersistence } from "y-indexeddb";
var createPersistence = (documentId, ydoc, { keyPrefix = "doc-" } = {}) => new IndexeddbPersistence(`${keyPrefix}${documentId}`, ydoc);
// src/collaboration/createProvider.ts
import { HocuspocusProvider } from "@hocuspocus/provider";
var createProvider = ({
  documentId,
  ydoc,
  url,
  getToken,
  documentName = (id) => `doc:${id}`
}) => new HocuspocusProvider({
  url,
  name: documentName(documentId),
  document: ydoc,
  token: getToken
});
// src/collaboration/useCollaboration.ts
import { useCallback, useEffect, useRef, useState } from "react";

// src/collaboration/ydocManager.ts
import * as Y from "yjs";
var docs = new Map;
var getOrCreateDoc = (noteId) => {
  const existing = docs.get(noteId);
  if (existing)
    return existing;
  const doc = new Y.Doc;
  docs.set(noteId, doc);
  return doc;
};
var destroyDoc = (noteId) => {
  const doc = docs.get(noteId);
  if (!doc)
    return;
  doc.destroy();
  docs.delete(noteId);
};
var hasDoc = (noteId) => docs.has(noteId);

// src/collaboration/useCollaboration.ts
var useCollaboration = ({
  documentId,
  url,
  getToken,
  documentName,
  cloudEnabled = false,
  persistence,
  onPeerCountChange
}) => {
  const [isLocalSynced, setIsLocalSynced] = useState(false);
  const [isRemoteSynced, setIsRemoteSynced] = useState(false);
  const [peerCount, setPeerCount] = useState(0);
  const [ydoc, setYdoc] = useState(null);
  const [provider, setProvider] = useState(null);
  const providerRef = useRef(null);
  const persistenceRef = useRef(null);
  const activeDocumentIdRef = useRef(null);
  const onPeerCountChangeRef = useRef(onPeerCountChange);
  onPeerCountChangeRef.current = onPeerCountChange;
  const updatePeerCount = useCallback((count) => {
    setPeerCount(count);
    onPeerCountChangeRef.current?.(count);
  }, []);
  const cleanup = useCallback(() => {
    updatePeerCount(0);
    providerRef.current?.destroy();
    providerRef.current = null;
    persistenceRef.current?.destroy();
    persistenceRef.current = null;
    if (activeDocumentIdRef.current) {
      destroyDoc(activeDocumentIdRef.current);
      activeDocumentIdRef.current = null;
    }
    setYdoc(null);
    setProvider(null);
    setIsLocalSynced(false);
    setIsRemoteSynced(false);
  }, [updatePeerCount]);
  useEffect(() => {
    if (!documentId) {
      cleanup();
      return;
    }
    const doc = getOrCreateDoc(documentId);
    activeDocumentIdRef.current = documentId;
    setYdoc(doc);
    const localPersistence = createPersistence(documentId, doc, {
      keyPrefix: persistence?.keyPrefix
    });
    persistenceRef.current = localPersistence;
    localPersistence.on("synced", () => {
      setIsLocalSynced(true);
    });
    if (cloudEnabled) {
      const prov = createProvider({
        documentId,
        ydoc: doc,
        url,
        getToken,
        documentName
      });
      providerRef.current = prov;
      setProvider(prov);
      prov.on("synced", () => {
        setIsRemoteSynced(true);
      });
      prov.on("disconnect", () => {
        setIsRemoteSynced(false);
        updatePeerCount(0);
      });
      prov.on("awarenessChange", ({ states }) => {
        updatePeerCount(Math.max(0, states.size - 1));
      });
    }
    return cleanup;
  }, [
    documentId,
    url,
    getToken,
    documentName,
    cloudEnabled,
    persistence?.keyPrefix,
    cleanup,
    updatePeerCount
  ]);
  return {
    ydoc,
    provider,
    isLocalSynced,
    isRemoteSynced,
    isSyncing: cloudEnabled && !isRemoteSynced && isLocalSynced,
    peerCount
  };
};
var useCollaboration_default = useCollaboration;
// src/editor/EditorCore.tsx
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

// src/editor/cn.ts
var cn = (...inputs) => inputs.filter(Boolean).join(" ");

// src/editor/plugins/ImageNode.tsx
import { $applyNodeReplacement, DecoratorNode } from "lexical";
import { jsxDEV } from "react/jsx-dev-runtime";

class ImageNode extends DecoratorNode {
  __src;
  __alt;
  __width;
  __height;
  static getType() {
    return "image";
  }
  static clone(node) {
    return new ImageNode(node.__src, node.__alt, node.__width, node.__height, node.__key);
  }
  constructor(src, alt, width, height, key) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
  }
  createDOM(_config) {
    const div = document.createElement("div");
    div.className = "my-2";
    return div;
  }
  updateDOM() {
    return false;
  }
  static importJSON(json) {
    return $createImageNode(json.src, json.alt, json.width, json.height);
  }
  exportJSON() {
    return {
      ...super.exportJSON(),
      type: "image",
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height
    };
  }
  getTextContent() {
    return `![${this.__alt}](${this.__src})`;
  }
  isInline() {
    return false;
  }
  decorate() {
    return /* @__PURE__ */ jsxDEV("figure", {
      children: [
        /* @__PURE__ */ jsxDEV("img", {
          src: this.__src,
          alt: this.__alt,
          width: this.__width,
          height: this.__height,
          loading: "lazy",
          className: "max-w-full rounded-lg"
        }, undefined, false, undefined, this),
        this.__alt && /* @__PURE__ */ jsxDEV("figcaption", {
          className: "mt-1 text-center text-muted-foreground text-sm",
          children: this.__alt
        }, undefined, false, undefined, this)
      ]
    }, undefined, true, undefined, this);
  }
}
function $createImageNode(src, alt, width, height) {
  return $applyNodeReplacement(new ImageNode(src, alt, width, height));
}
function $isImageNode(node) {
  return node instanceof ImageNode;
}

// src/editor/plugins/LocalContentPlugin.tsx
import {
  $convertFromMarkdownString,
  $convertToMarkdownString
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect as useEffect2, useRef as useRef2 } from "react";

// src/editor/transformers.ts
import { TRANSFORMERS as LEXICAL_TRANSFORMERS } from "@lexical/markdown";
var IMAGE_TRANSFORMER = {
  dependencies: [ImageNode],
  export: (node) => {
    if (!$isImageNode(node))
      return null;
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
  type: "text-match"
};
var TRANSFORMERS = [...LEXICAL_TRANSFORMERS, IMAGE_TRANSFORMER];

// src/editor/plugins/LocalContentPlugin.tsx
function LocalContentPlugin({
  initialContent,
  onContentChange
}) {
  const [editor] = useLexicalComposerContext();
  const initializedRef = useRef2(false);
  const contentRef = useRef2(initialContent);
  useEffect2(() => {
    if (initializedRef.current)
      return;
    initializedRef.current = true;
    editor.update(() => {
      $convertFromMarkdownString(initialContent, TRANSFORMERS);
    });
  }, [editor, initialContent]);
  useEffect2(() => {
    if (contentRef.current === initialContent)
      return;
    contentRef.current = initialContent;
    initializedRef.current = true;
    editor.update(() => {
      $convertFromMarkdownString(initialContent, TRANSFORMERS);
    });
  }, [editor, initialContent]);
  useEffect2(() => {
    return editor.registerUpdateListener(({ editorState, dirtyElements, dirtyLeaves }) => {
      if (dirtyElements.size === 0 && dirtyLeaves.size === 0)
        return;
      editorState.read(() => {
        const markdown = $convertToMarkdownString(TRANSFORMERS);
        onContentChange(markdown);
      });
    });
  }, [editor, onContentChange]);
  return null;
}

// src/editor/EditorCore.tsx
import { jsxDEV as jsxDEV2 } from "react/jsx-dev-runtime";
var BASE_NODES = [
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
  ImageNode
];
var defaultOnError = (error) => {
  console.error("Lexical error:", error);
};
var EditorCore = ({
  documentId,
  namespace = "OmniEditor",
  theme = {},
  nodes,
  plugins,
  className,
  contentEditableClassName,
  renderContentEditable,
  placeholder = null,
  ariaPlaceholder,
  onError = defaultOnError,
  ydoc,
  provider,
  username,
  cursorColor,
  initialContent,
  onContentChange
}) => {
  const initialConfig = {
    namespace,
    theme,
    nodes: [...BASE_NODES, ...nodes ?? []],
    onError,
    editorState: null
  };
  const isCollab = Boolean(provider && ydoc);
  const contentEditable = placeholder ? /* @__PURE__ */ jsxDEV2(ContentEditable, {
    className: contentEditableClassName,
    "aria-placeholder": ariaPlaceholder ?? "",
    placeholder
  }, undefined, false, undefined, this) : /* @__PURE__ */ jsxDEV2(ContentEditable, {
    className: contentEditableClassName
  }, undefined, false, undefined, this);
  return /* @__PURE__ */ jsxDEV2(LexicalComposer, {
    initialConfig,
    children: /* @__PURE__ */ jsxDEV2("div", {
      className: cn("relative", className),
      children: [
        /* @__PURE__ */ jsxDEV2(RichTextPlugin, {
          contentEditable: renderContentEditable ? renderContentEditable(contentEditable) : contentEditable,
          placeholder: null,
          ErrorBoundary: LexicalErrorBoundary
        }, undefined, false, undefined, this),
        isCollab && ydoc && provider ? /* @__PURE__ */ jsxDEV2(CollaborationPlugin, {
          id: documentId ?? namespace,
          providerFactory: (id, yjsDocMap) => {
            yjsDocMap.set(id, ydoc);
            return provider;
          },
          shouldBootstrap: false,
          username,
          cursorColor
        }, undefined, false, undefined, this) : initialContent !== undefined && onContentChange ? /* @__PURE__ */ jsxDEV2(LocalContentPlugin, {
          initialContent,
          onContentChange
        }, undefined, false, undefined, this) : null,
        /* @__PURE__ */ jsxDEV2(ListPlugin, {}, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV2(LinkPlugin, {}, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV2(CheckListPlugin, {}, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV2(MarkdownShortcutPlugin, {
          transformers: TRANSFORMERS
        }, undefined, false, undefined, this),
        /* @__PURE__ */ jsxDEV2(HorizontalRulePlugin, {}, undefined, false, undefined, this),
        plugins
      ]
    }, undefined, true, undefined, this)
  }, undefined, false, undefined, this);
};
// src/editor/plugins/MobileToolbar.tsx
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from "@lexical/list";
import { useLexicalComposerContext as useLexicalComposerContext2 } from "@lexical/react/LexicalComposerContext";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $setBlocksType } from "@lexical/selection";
import { $getSelection, $isRangeSelection, FORMAT_TEXT_COMMAND } from "lexical";
import {
  Bold,
  CheckSquare,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote
} from "lucide-react";
import { jsxDEV as jsxDEV3 } from "react/jsx-dev-runtime";
function MobileToolbar() {
  const [editor] = useLexicalComposerContext2();
  const setBlock = (create) => editor.update(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection))
      $setBlocksType(selection, create);
  });
  const actions = [
    {
      icon: Bold,
      label: "Bold",
      run: (e) => e.dispatchCommand(FORMAT_TEXT_COMMAND, "bold")
    },
    {
      icon: Italic,
      label: "Italic",
      run: (e) => e.dispatchCommand(FORMAT_TEXT_COMMAND, "italic")
    },
    {
      icon: Heading1,
      label: "Heading 1",
      run: () => setBlock(() => $createHeadingNode("h1"))
    },
    {
      icon: Heading2,
      label: "Heading 2",
      run: () => setBlock(() => $createHeadingNode("h2"))
    },
    {
      icon: List,
      label: "Bulleted list",
      run: (e) => e.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined)
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      run: (e) => e.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined)
    },
    {
      icon: CheckSquare,
      label: "Checklist",
      run: (e) => e.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined)
    },
    {
      icon: Quote,
      label: "Quote",
      run: () => setBlock(() => $createQuoteNode())
    }
  ];
  return /* @__PURE__ */ jsxDEV3("div", {
    className: "fixed inset-x-0 bottom-0 z-40 flex gap-1 overflow-x-auto border-t bg-background/95 px-2 py-1.5 backdrop-blur md:hidden",
    style: { paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" },
    children: actions.map(({ icon: Icon, label, run }) => /* @__PURE__ */ jsxDEV3("button", {
      type: "button",
      "aria-label": label,
      className: cn("inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"),
      onMouseDown: (event) => event.preventDefault(),
      onClick: () => run(editor),
      children: /* @__PURE__ */ jsxDEV3(Icon, {
        className: "h-5 w-5"
      }, undefined, false, undefined, this)
    }, label, false, undefined, this))
  }, undefined, false, undefined, this);
}
export {
  $createImageNode,
  $isImageNode,
  EditorCore,
  IMAGE_TRANSFORMER,
  ImageNode,
  LocalContentPlugin,
  MobileToolbar,
  TRANSFORMERS,
  createPersistence,
  createProvider,
  destroyDoc,
  getOrCreateDoc,
  hasDoc,
  useCollaboration_default as useCollaboration
};
