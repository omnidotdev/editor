---
"@omnidotdev/editor": patch
---

fix(editor): restore undo/redo in local (non-collaborative) mode

`EditorCore` never registered a history handler for local-first editing, so `UNDO_COMMAND`/`REDO_COMMAND` (dispatched by keyboard shortcuts and menus) were silently dropped and undo/redo did nothing. Collaborative mode was unaffected because `CollaborationPlugin` owns history via the Yjs `UndoManager`. Add Lexical's `HistoryPlugin`, gated to local mode only (`!isCollab`), so it never conflicts with the collaborative undo stack.
