import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { createContext } from "./createContext.js";

/** @typedef {{anchorNav: boolean }} AnchorNavContextState */

const {
  createContextProvider: createAnchorNavContextProvider,
  createContextConsumer: createAnchorNavContextConsumer,
} = createContext("anchorNav", { anchorNav: false }, null, null, true);

export { createAnchorNavContextProvider, createAnchorNavContextConsumer };
