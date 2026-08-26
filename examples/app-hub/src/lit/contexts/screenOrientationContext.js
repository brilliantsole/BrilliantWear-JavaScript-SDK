import { createContext } from "./createContext.js";

/** @typedef {{angle: number, type: OrientationType }} ScreenOrientationContextState */

/** @returns {ScreenOrientationContextState} */
const getScreenOrientationState = () => {
  const { type, angle } = window.screen.orientation;
  return { type, angle };
};

const {
  createContextProvider: createScreenOrientationContextProvider,
  createContextConsumer: createScreenOrientationContextConsumer,
} = await createContext("screenOrientation", {
  defaultState: getScreenOrientationState(),
  onProviderHostConnection: (provider, abortController) => {
    window.screen.orientation.addEventListener(
      "change",
      () => {
        // console.log("screen.orientation.change");
        const screenOrientationState = getScreenOrientationState();
        // console.log({ screenOrientationState });
        provider.value.update(screenOrientationState);
      },
      { signal: abortController.signal },
    );
  },
});

export {
  createScreenOrientationContextProvider,
  createScreenOrientationContextConsumer,
};
