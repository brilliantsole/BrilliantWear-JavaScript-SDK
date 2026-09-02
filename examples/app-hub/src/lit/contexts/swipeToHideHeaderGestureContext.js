import { createContext } from "./createContext.js";

/** @typedef {{isSwipeToHideHeaderEnabled: boolean }} SwipeToHideHeaderGestureContextState */

const {
  createContextProvider: createSwipeToHideHeaderGestureContextProvider,
  createContextConsumer: createSwipeToHideHeaderGestureContextConsumer,
} = await createContext("swipeToHideHeaderGesture", {
  defaultState: { isSwipeToHideHeaderEnabled: true },
  storageType: "localStorage",
});

export {
  createSwipeToHideHeaderGestureContextProvider,
  createSwipeToHideHeaderGestureContextConsumer,
};
