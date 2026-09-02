import { createContext } from "./createContext.js";

/** @typedef {{isLeftToRight: boolean }} DirectionContextState */

/** @returns {DirectionContextState} */
const getDirectionState = () => {
  const { direction } = getComputedStyle(document.documentElement);
  const isLeftToRight = direction == "ltr";
  // console.log({ direction, isLeftToRight });
  return { isLeftToRight };
};

const lrtMediaQuery = window.matchMedia("(prefers-direction: lrt)");
const rtlMediaQuery = window.matchMedia("(prefers-direction: rtl)");
const directionMediaQueries = [lrtMediaQuery, rtlMediaQuery];

const {
  createContextProvider: createDirectionContextProvider,
  createContextConsumer: createDirectionContextConsumer,
} = await createContext("direction", {
  defaultState: getDirectionState(),
  onProviderHostConnection: (provider, abortController) => {
    const onDirectionChange = () => {
      console.log("onDirectionChange");
      const directionState = getDirectionState();
      // console.log("directionState", directionState);
      provider.value.update(directionState);
    };

    const observer = new MutationObserver(() => {
      onDirectionChange();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });
    abortController.signal.addEventListener(
      "abort",
      () => {
        observer.disconnect();
      },
      { once: true },
    );

    directionMediaQueries.forEach((mediaQuery) => {
      console.log(mediaQuery);
      mediaQuery.addEventListener(
        "change",
        () => {
          onDirectionChange();
        },
        { signal: abortController.signal },
      );
    });
  },
});

export { createDirectionContextProvider, createDirectionContextConsumer };
