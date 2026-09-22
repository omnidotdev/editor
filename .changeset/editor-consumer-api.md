---
"@omnidotdev/editor": minor
---

Add a `documentName` passthrough to `useCollaboration` and a `renderContentEditable` wrapper to `EditorCore`. Both come from real adoption feedback: consumers can now preserve a custom Hocuspocus room-name scheme (e.g. `note:${id}`) through the hook, and wrap the editable surface (e.g. in a context menu) without dropping to the lower-level factories.
