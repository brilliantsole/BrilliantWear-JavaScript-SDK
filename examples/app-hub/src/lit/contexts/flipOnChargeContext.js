import { createContext } from "./createContext.js";

/** @typedef {{flipOnCharge: boolean }} FlipOnChargeContextState */

const {
  createContextProvider: createFlipOnChargeContextProvider,
  createContextConsumer: createFlipOnChargeContextConsumer,
} = await createContext("flipOnCharge", {
  defaultState: { flipOnCharge: false },
  storageType: "localStorage",
});

export { createFlipOnChargeContextProvider, createFlipOnChargeContextConsumer };
