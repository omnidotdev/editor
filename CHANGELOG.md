# @omnidotdev/editor

## 0.1.2

### Patch Changes

- [#10](https://github.com/omnidotdev/editor/pull/10) [`9e502f4`](https://github.com/omnidotdev/editor/commit/9e502f4c79fe94598ded59ff21f239f552f2689c) Thanks [@coopbri](https://github.com/coopbri)! - fix(editor): restore undo/redo in local (non-collaborative) mode
  
  `EditorCore` never registered a history handler for local-first editing, so `UNDO_COMMAND`/`REDO_COMMAND` (dispatched by keyboard shortcuts and menus) were silently dropped and undo/redo did nothing. Collaborative mode was unaffected because `CollaborationPlugin` owns history via the Yjs `UndoManager`. Add Lexical's `HistoryPlugin`, gated to local mode only (`!isCollab`), so it never conflicts with the collaborative undo stack.

## 0.1.1

### Patch Changes

- [`a8aae33`](https://github.com/omnidotdev/editor/commit/a8aae33333da9e2f3a54642719279fde1d5205b5) Thanks [@coopbri](https://github.com/coopbri)! - Build with the production automatic JSX runtime. The bundle previously shipped the development runtime (literal `jsxDEV` calls and a `react/jsx-dev-runtime` import), which threw `TypeError: jsxDEV is not a function` in any consumer's production build (React's production `jsx-dev-runtime` leaves `jsxDEV` undefined) and took down every view that rendered the editor. The build now sets `NODE_ENV=production` so Bun emits `jsx`/`jsxs`, and consumers can drop their build-time `jsx-dev-runtime` shims.
