import { createContext } from "./createContext.js";

/** @typedef {{isLeftHanded: boolean }} IsLeftHandedContextState */

const {
  createContextProvider: createIsLeftHandedContextProvider,
  createContextConsumer: createIsLeftHandedContextConsumer,
} = await createContext("leftHanded", {
  defaultState: { isLeftHanded: false },
  storageType: "localStorage",
});

export { createIsLeftHandedContextProvider, createIsLeftHandedContextConsumer };
