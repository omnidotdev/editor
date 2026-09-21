# @omnidotdev/editor

Headless collaborative rich-text editor (Lexical + Yjs + Hocuspocus) shared across Omni products.

The package is product-agnostic: it ships the collaboration plumbing, a base
Lexical node set, and the core rich-text plugins, and exposes injection points
(`nodes`, `plugins`, `AuthAdapter`, `AssetStorageAdapter`) so each product wires
in its own auth, asset storage, and bespoke plugins (wikilinks, transclusions,
slash commands, etc.). Consumed by Trellis and Folio.

## Installation

```bash
bun add @omnidotdev/editor
```

Lexical, Yjs, `@hocuspocus/provider`, and React are peer dependencies (install
them in the consuming app). `y-indexeddb` and `lucide-react` ship as
dependencies.

## Public API

Collaboration:

- `useCollaboration(options)` - React hook orchestrating the Y.Doc, IndexedDB
  persistence, and the Hocuspocus provider
- `createProvider(options)` - build a Hocuspocus provider
- `createPersistence(documentId, ydoc, options)` - build an IndexedDB persistence layer
- `getOrCreateDoc`, `destroyDoc`, `hasDoc` - Y.Doc lifecycle manager

Editor:

- `EditorCore` - headless Lexical editor (collaborative or local-first)
- `ImageNode`, `$createImageNode`, `$isImageNode` - reusable image node
- `TRANSFORMERS`, `IMAGE_TRANSFORMER` - markdown transformers
- `LocalContentPlugin` - local-first markdown load/serialize plugin
- `MobileToolbar` - touch formatting toolbar

Adapters (types):

- `AuthAdapter` - `{ getToken: () => Promise<string> }`
- `AssetStorageAdapter` - `{ upload(file), resolve?(src) }`

## Usage

### Collaborative mode

```tsx
import { EditorCore, useCollaboration } from "@omnidotdev/editor";

const Editor = ({ documentId }: { documentId: string }) => {
  const { ydoc, provider } = useCollaboration({
    documentId,
    url: import.meta.env.VITE_COLLABORATION_URL,
    getToken: async () => myAuth.getToken(),
    cloudEnabled: true,
    persistence: { keyPrefix: "trellis-note-" },
    onPeerCountChange: (n) => setPeerCount(n),
  });

  return (
    <EditorCore
      documentId={documentId}
      ydoc={ydoc ?? undefined}
      provider={provider}
      username="Ada"
      cursorColor="#DD6E33"
      theme={myTheme}
      nodes={[WikilinkNode]}
      plugins={<WikilinkPlugin notes={notes} />}
    />
  );
};
```

### Local-first mode

```tsx
<EditorCore
  initialContent={markdown}
  onContentChange={setMarkdown}
  theme={myTheme}
/>
```

## Development

```bash
bun install
bun run typecheck   # tsc --noEmit
bun run build       # bundle + emit declarations to build/
bun run check       # biome
bun run knip        # dead-code / unused-dependency check
```
