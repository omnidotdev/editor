import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
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
  Quote,
} from "lucide-react";

import { cn } from "../cn";

import type { HeadingTagType } from "@lexical/rich-text";
import type { LexicalEditor } from "lexical";
import type { ComponentType } from "react";

/**
 * Floating formatting toolbar for touch devices. Slash commands and keyboard
 * shortcuts are impractical on a phone keyboard, so this exposes the common
 * block/inline actions. Hidden at md+ where the desktop affordances apply.
 */
function MobileToolbar() {
  const [editor] = useLexicalComposerContext();

  const setBlock = (
    create: () =>
      | ReturnType<typeof $createHeadingNode>
      | ReturnType<typeof $createQuoteNode>,
  ) =>
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) $setBlocksType(selection, create);
    });

  const actions: Array<{
    icon: ComponentType<{ className?: string }>;
    label: string;
    run: (editor: LexicalEditor) => void;
  }> = [
    {
      icon: Bold,
      label: "Bold",
      run: (e) => e.dispatchCommand(FORMAT_TEXT_COMMAND, "bold"),
    },
    {
      icon: Italic,
      label: "Italic",
      run: (e) => e.dispatchCommand(FORMAT_TEXT_COMMAND, "italic"),
    },
    {
      icon: Heading1,
      label: "Heading 1",
      run: () => setBlock(() => $createHeadingNode("h1" as HeadingTagType)),
    },
    {
      icon: Heading2,
      label: "Heading 2",
      run: () => setBlock(() => $createHeadingNode("h2" as HeadingTagType)),
    },
    {
      icon: List,
      label: "Bulleted list",
      run: (e) => e.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined),
    },
    {
      icon: ListOrdered,
      label: "Numbered list",
      run: (e) => e.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined),
    },
    {
      icon: CheckSquare,
      label: "Checklist",
      run: (e) => e.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined),
    },
    {
      icon: Quote,
      label: "Quote",
      run: () => setBlock(() => $createQuoteNode()),
    },
  ];

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 flex gap-1 overflow-x-auto border-t bg-background/95 px-2 py-1.5 backdrop-blur md:hidden"
      style={{ paddingBottom: "max(0.375rem, env(safe-area-inset-bottom))" }}
    >
      {actions.map(({ icon: Icon, label, run }) => (
        <button
          key={label}
          type="button"
          aria-label={label}
          className={cn(
            "inline-flex h-9 shrink-0 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
          // Prevent the editor from losing selection on touch
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => run(editor)}
        >
          <Icon className="h-5 w-5" />
        </button>
      ))}
    </div>
  );
}

export { MobileToolbar };
