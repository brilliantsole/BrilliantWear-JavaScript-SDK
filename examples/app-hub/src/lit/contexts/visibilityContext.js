import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { createContext } from "./createContext.js";

/** @typedef {{hidden: boolean }} VisibilityContextState */

/** @returns {VisibilityContextState} */
const getVisibilityState = () => {
  const { hidden } = document;
  return { hidden };
};

const {
  createContextProvider: createVisibilityContextProvider,
  createContextConsumer: createVisibilityContextConsumer,
} = await createContext("visibility", {
  defaultState: getVisibilityState(),
  onProviderHostConnection: (provider, abortController) => {
    document.addEventListener(
      "visibilitychange",
      (event) => {
        // console.log("screen.orientation.change");
        const visibilityState = getVisibilityState();
        // console.log({ visibilityState });
        provider.value.update(visibilityState);
      },
      { signal: abortController.signal },
    );
  },
});

export { createVisibilityContextProvider, createVisibilityContextConsumer };
