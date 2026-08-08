// based on https://github.com/lit/lit/blob/c42ee1e96b8fd61f7256f61d715daef572e76e52/packages/labs/router/src/router.ts

import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
import { defaultPath, tabs } from "../components/AppHub.js";
const { litRouter } = await waitForGlobals();

const origin = location.origin || location.protocol + "//" + location.host;
const baseUrl = new URL(location);

const latestRouterStateSessionStorageKey = "latest-router-state";

const saveLatestEntryToLocalStorage = true;
const saveEntriesToLocalStorage = true; // need to save to sessionStorage for safari iOS
const routerStateSessionsStorageKeyPrefix = "router-states";
const entryKey = "index"; // safari iOS's key isn't consistent
// TODO - store a buffer ring of indices (safari has a max of 99 entries)
navigation.addEventListener("currententrychange", (event) => {
  const { from, navigationType } = event;
  const { currentEntry } = navigation;
  const currentState = currentEntry.getState();
  console.log("currententrychange", currentEntry, currentState);
  if (!currentState) {
    return;
  }

  const currentStateString = JSON.stringify(currentState);

  if (saveLatestEntryToLocalStorage) {
    // console.log(
    //   "saving currentState with latestRouterStateSessionStorageKey",
    //   currentState,
    // );

    sessionStorage.setItem(
      latestRouterStateSessionStorageKey,
      currentStateString,
    );
  }

  if (saveEntriesToLocalStorage) {
    const key = `${routerStateSessionsStorageKeyPrefix}-${currentEntry[entryKey]}`;
    // console.log(`saving currentState with key ${key}`, currentState);
    sessionStorage.setItem(key, currentStateString);
  }
});

if (saveEntriesToLocalStorage) {
  const _getNavigationHistoryEntryState =
    NavigationHistoryEntry.prototype.getState;
  const _getNavigationDestinationState =
    NavigationDestination.prototype.getState;

  /** @param {NavigationHistoryEntry | NavigationDestination} entry */
  const getState = (entry) => {
    // console.log("getState interception", this);
    const key = `${routerStateSessionsStorageKeyPrefix}-${entry[entryKey]}`;
    const stateString = sessionStorage.getItem(key);
    // console.log("sessionStorage", { key, stateString });
    if (stateString) {
      try {
        const state = JSON.parse(stateString);
        // console.log("sessionStorage state", state);
        return state;
      } catch (error) {
        console.error("failed to parse stateString", error);
      }
    }
  };

  NavigationHistoryEntry.prototype.getState = function () {
    const state = _getNavigationHistoryEntryState.call(this);
    if (state) {
      // console.log("existing state", state);
      return state;
    }
    return getState(this);
  };
  NavigationDestination.prototype.getState = function () {
    const state = _getNavigationDestinationState.call(this);
    if (state) {
      // console.log("existing state", state);
      return state;
    }
    return getState(this);
  };
}

export class Router extends litRouter.Routes {
  constructor(host, routes, defaultRoute) {
    super(host, routes);
    this._defaultRoute = defaultRoute ?? "/";
    this._host = host;
    console.log("Router", this);
    this.reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.reducedMotionEnabled = this.reducedMotion.matches;
    this.reducedMotion.addEventListener("change", (event) => {
      this.reducedMotionEnabled = event.matches;
      console.log("reducedMotionEnabled", this.reducedMotionEnabled);
    });
  }
  hostConnected() {
    super.hostConnected();
    navigation.addEventListener("navigate", this._onNavigate);
    navigation.addEventListener(
      "currententrychange",
      this._onCurrentEntryChange,
    );
    // Kick off routed rendering by going to the current URL
    const entries = navigation.entries();
    if (entries.length == 1) {
      const state = entries[0].getState();
      if (state) {
        console.log("loading state", state);
        this.goto(state.route);
      } else {
        console.log("setting initial state");
        const state = { route: this._defaultRoute };
        navigation.updateCurrentEntry({ state });
        this.goto(state.route);
      }
    } else {
      const entryIndex = navigation.currentEntry.index;
      const state = navigation.currentEntry.getState();
      console.log({ entryIndex, state });
      if (state) {
        console.log("loading state", state);
        this.goto(state.route);
      } else {
        try {
          const stateString = sessionStorage.getItem(
            latestRouterStateSessionStorageKey,
          );
          const state = JSON.parse(stateString);
          console.log("session state", state);
          navigation.updateCurrentEntry({ state });
          this.goto(state.route);
        } catch (error) {
          console.log("no sessionStorage - traversing to latest");
          for (let i = entries.length; i >= 0; i--) {
            entries;
          }
          entries.reverse().some((entry) => {
            const state = entry.getState();
            if (state) {
              console.log("using prior state");
              navigation.updateCurrentEntry({ state });
              this.goto(state.route);
              return true;
            }
          });
          console.log("failed to find valid entry - going to root");
          const state = { route: this._defaultRoute };
          navigation.updateCurrentEntry({ state });
          this.goto(state.route);
        }
      }
    }
  }

  hostDisconnected() {
    super.hostDisconnected();
    navigation.removeEventListener("navigate", this._onNavigate);
    navigation.removeEventListener(
      "currententrychange",
      this._onCurrentEntryChange,
    );
  }

  /** @param {NavigationEventMap["currententrychange"]} e */
  _onCurrentEntryChange = (e) => {
    const { from, navigationType } = e;
    const { currentEntry } = navigation;
    const currentState = currentEntry.getState();
    console.log("_onCurrentEntryChange", {
      navigationType,
      from,
      currentEntry,
      currentState,
    });
    if (!currentState) {
      console.log("currentState not defined - updating");
      const state = { route: this._defaultRoute };
      navigation.updateCurrentEntry({ state });
    }
  };
  /** @param {NavigationEventMap["navigate"]} e */
  _onNavigate = (e) => {
    const { destination, navigationType } = e;
    const { currentEntry } = navigation;
    console.log("_onNavigate", destination, { navigationType });

    const url = new URL(destination.url);

    // Ignore cross-origin navigations
    if (url.origin !== origin) {
      return;
    }

    // Let browser handle downloads, external targets, etc.
    if (e.downloadRequest || e.info?.external || e.hashChange) {
      return;
    }

    const destinationState = destination.getState();
    const currentState = currentEntry.getState();
    console.log({ destinationState, currentState });

    // if (!destinationState) {
    //   console.warn("undefined destinationState - not traversing");
    //   try {
    //     e.preventDefault();
    //   } catch (error) {}
    //   navigation.updateCurrentEntry({
    //     state: { ...currentState },
    //   });
    //   return;
    // }

    if (navigationType == "traverse" && !destinationState) {
      console.warn("no destinationState for traversal");
      e.intercept({
        handler: async () => {
          await this.goto(route);
        },
      });
      return;
    }

    const isBase = url.pathname == baseUrl.pathname;
    const route = destinationState?.route ?? url.pathname;

    console.log({
      urlPathname: url.pathname,
      baseUrlPathname: baseUrl.pathname,
      isBase,
      route,
    });

    if (currentState.route == route) {
      console.log("redundant route - skipping");
      try {
        e.preventDefault();
      } catch (error) {}
      const state = {
        ...currentState,
        repeat: (currentState?.repeat ?? 0) + 1,
      };
      navigation.updateCurrentEntry({
        state,
      });
      return;
    }

    if (isBase) {
      console.log("about to intercept navigation");
      e.intercept({
        handler: async () => {
          console.log("routeHandler", { route }, tabs);

          const activeTab =
            route.split("/")?.filter(Boolean)?.[0] ?? defaultPath;
          const tabIndex = tabs.indexOf(activeTab);
          console.log({ route, activeTab, tabIndex });

          const previousRoute = currentState.route;
          const previousTab = previousRoute.split("/")?.filter(Boolean)?.[0];
          const previousTabIndex = tabs.indexOf(previousTab);
          console.log({ previousRoute, previousTab, previousTabIndex });

          const render = async () => {
            document.documentElement.dataset.activeTab = activeTab;
            await this.goto(route);
          };

          if (
            !document.startViewTransition ||
            this.reducedMotionEnabled ||
            this._host.skipViewTransitions
          ) {
            await render();
            return;
          }

          const types = [];
          if (tabIndex != previousTabIndex) {
            console.log(
              `moving from "${previousTab}" tab to "${activeTab}" tab`,
            );
            types.push(
              tabIndex > previousTabIndex ? "next-tab" : "previous-tab",
            );
          } else {
            // FILL - moving between paths of the same route
          }
          console.log("view transition types", types);

          await document.startViewTransition({
            update: async () => {
              await render();
            },
            types,
          }).finished;
        },
      });
    } else {
      try {
        e.preventDefault();
      } catch (error) {}
      const state = { route };
      navigation.navigate("./", { state, history: "push" });
    }
  };
}
