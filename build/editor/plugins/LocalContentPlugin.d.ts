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
declare function LocalContentPlugin({ initialContent, onContentChange, }: LocalContentPluginProps): null;
export { LocalContentPlugin };
//# sourceMappingURL=LocalContentPlugin.d.ts.map