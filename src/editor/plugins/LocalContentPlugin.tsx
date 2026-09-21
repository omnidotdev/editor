import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
} from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

import { TRANSFORMERS } from "../transformers";

type LocalContentPluginProps = {
  /** Initial markdown content to load into the editor */
  initialContent: string;
  /** Called with serialized markdown when editor content changes */
  onContentChange: (markdown: string) => void;
};

/**
 * Plugin for local-first mode: initializes Lexical from markdown
 * and serializes changes back via callback
 */
function LocalContentPlugin({
  initialContent,
  onContentChange,
}: LocalContentPluginProps) {
  const [editor] = useLexicalComposerContext();
  const initializedRef = useRef(false);
  const contentRef = useRef(initialContent);

  // Initialize editor with markdown content on mount
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    editor.update(() => {
      $convertFromMarkdownString(initialContent, TRANSFORMERS);
    });
  }, [editor, initialContent]);

  // Reset when content identity changes (new document loaded)
  useEffect(() => {
    if (contentRef.current === initialContent) return;
    contentRef.current = initialContent;
    initializedRef.current = true;

    editor.update(() => {
      $convertFromMarkdownString(initialContent, TRANSFORMERS);
    });
  }, [editor, initialContent]);

  // Listen for changes and serialize back to markdown
  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        // Skip updates with no actual changes
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;

        editorState.read(() => {
          const markdown = $convertToMarkdownString(TRANSFORMERS);
          onContentChange(markdown);
        });
      },
    );
  }, [editor, onContentChange]);

  return null;
}

export { LocalContentPlugin };
