// Collaboration core
export {
  createPersistence,
  createProvider,
  destroyDoc,
  getOrCreateDoc,
  hasDoc,
  useCollaboration,
} from "./collaboration";
// Editor
export { EditorCore } from "./editor/EditorCore";
export {
  $createImageNode,
  $isImageNode,
  ImageNode,
} from "./editor/plugins/ImageNode";
export { LocalContentPlugin } from "./editor/plugins/LocalContentPlugin";
export { MobileToolbar } from "./editor/plugins/MobileToolbar";
export { IMAGE_TRANSFORMER, TRANSFORMERS } from "./editor/transformers";

// Adapter contracts
export type { AssetStorageAdapter, AuthAdapter } from "./editor/adapters";
