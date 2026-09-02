import { createContext } from "./createContext.js";

/** @typedef {{isSwipeToChangeTabEnabled: boolean }} SwipeToChangeTabGestureContextState */

const {
  createContextProvider: createSwipeToChangeTabGestureContextProvider,
  createContextConsumer: createSwipeToChangeTabGestureContextConsumer,
} = await createContext("swipeToChangeTabGesture", {
  defaultState: { isSwipeToChangeTabEnabled: true },
  storageType: "localStorage",
});

export {
  createSwipeToChangeTabGestureContextProvider,
  createSwipeToChangeTabGestureContextConsumer,
};
