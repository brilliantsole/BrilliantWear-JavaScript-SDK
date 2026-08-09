import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { litContext } = await waitForGlobals();
const { ContextProvider, ContextConsumer } = litContext;

/**
 * @param {string} key
 * @param {any} defaultState
 */
export function createContext(key, defaultState) {
  const contextKey = Symbol(key);
  const context = litContext.createContext(contextKey);

  /**
   * @param {import("lit").LitElement} host
   * @param {any?} state
   * @param {((state: any, oldState: any) => void)?} callback
   */
  const createContextProvider = (host, state, callback) => {
    console.log("createContextProvider", host, state, callback);
    const value = {
      state: { ...defaultState, ...structuredClone(state) },
      update: (newState, force) => {
        console.log("update", newState);
        // FIX
        if (false && !force) {
          return;
        }
        const oldState = value.state;
        value.state = newState;
        callback?.(newState, oldState);
        console.log("updating provider", provider, value);
        provider.setValue(value, true);
      },
    };
    const provider = new ContextProvider(host, {
      context,
      initialValue: value,
    });
    return provider;
  };
  /**
   * @param {import("lit").LitElement} host
   * @param {boolean} subscribe
   * @param {(state) => void?} callback
   */
  const createContextConsumer = (host, subscribe, callback) => {
    console.log("createContextProvider", host, { subscribe }, callback);
    const consumer = new ContextConsumer(host, {
      context,
      subscribe,
      callback: (value) => {
        callback?.(value.state);
      },
    });
    return consumer;
  };
  return { createContextProvider, createContextConsumer };
}
