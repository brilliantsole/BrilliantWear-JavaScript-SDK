import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { createContext } from "./createContext.js";

/** @typedef {{anchorNav: boolean }} AnchorNavContextState */

const {
  createContextProvider: createAnchorNavContextProvider,
  createContextConsumer: createAnchorNavContextConsumer,
} = await createContext("anchorNav", {
  defaultState: { anchorNav: false },
  storageType: "localStorage",
});

export { createAnchorNavContextProvider, createAnchorNavContextConsumer };
