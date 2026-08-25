import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

import { createContext } from "./createContext.js";

/** @typedef {"light" | "dark"} ThemeContextValue */
/** @typedef {ThemeContextValue | "system"} ThemeContextSelection */
/** @typedef {{systemTheme: ThemeContextValue, selectedTheme: ThemeContextSelection }} ThemeContextState */

const darkColorSchemeMediaQuery = window.matchMedia(
  "(prefers-color-scheme: dark)",
);

/** @returns {ThemeContextValue} */
const getSystemThemeValue = () => {
  return darkColorSchemeMediaQuery.matches ? "dark" : "light";
};

/** @param {ThemeContextState} state */
export const getTheme = (state) => {
  // console.log("getTheme", state);
  return state.selectedTheme == "system"
    ? state.systemTheme
    : state.selectedTheme;
};

const {
  createContextProvider: createThemeContextProvider,
  createContextConsumer: createThemeContextConsumer,
} = await createContext("theme", {
  defaultState: {
    selectedTheme: "system",
    systemTheme: getSystemThemeValue(),
  },
  storageType: "localStorage",
  onProviderHostConnection: (provider, abortController) => {
    const onSystemThemeChange = () => {
      // console.log("onSystemThemeChange");
      const systemTheme = getSystemThemeValue();
      // console.log({ systemTheme });
      const { theme } = provider.value.state;
      provider.value.update({
        ...provider.value.state,
        systemTheme,
        position: undefined,
      });
    };
    darkColorSchemeMediaQuery.addEventListener(
      "change",
      () => {
        // console.log("darkColorSchemeMediaQuery.change");
        onSystemThemeChange();
      },
      { signal: abortController.signal },
    );
    onSystemThemeChange();
  },
});

export { createThemeContextProvider, createThemeContextConsumer };
