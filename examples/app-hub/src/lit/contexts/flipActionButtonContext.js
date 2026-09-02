import { createContext } from "./createContext.js";

/** @typedef {{visible: boolean }} FlipActionButtonContextState */

const {
  createContextProvider: createFlipActionButtonContextProvider,
  createContextConsumer: createFlipActionButtonContextConsumer,
} = await createContext("flipActionButton", {
  defaultState: { visible: true },
  storageType: "localStorage",
});

export {
  createFlipActionButtonContextProvider,
  createFlipActionButtonContextConsumer,
};
