import { createContext } from "./createContext.js";

/** @typedef {"left" | "right" | "top" | "bottom"} HeaderSide */
/** @typedef {{headerSide: HeaderSide }} HeaderSideContextState */

const {
  createContextProvider: createHeaderSideContextProvider,
  createContextConsumer: createHeaderSideContextConsumer,
} = await createContext("headerSide", {
  defaultState: { headerSide: "bottom" },
});

export { createHeaderSideContextProvider, createHeaderSideContextConsumer };
