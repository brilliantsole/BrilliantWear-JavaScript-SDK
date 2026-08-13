import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { litContext } = await waitForGlobals();
const { ContextProvider, ContextConsumer } = litContext;

function deepEqual(val1, val2) {
  // Base case: strict equality for primitives
  if (val1 === val2) return true;

  // Handle null and verify both are objects
  if (
    val1 === null ||
    val2 === null ||
    typeof val1 !== "object" ||
    typeof val2 !== "object"
  ) {
    return false;
  }

  // Handle array length or object key count mismatches
  const keys1 = Object.keys(val1);
  const keys2 = Object.keys(val2);
  if (keys1.length !== keys2.length) return false;

  // Recursively check every key and value
  for (const key of keys1) {
    if (!keys2.includes(key) || !deepEqual(val1[key], val2[key])) {
      return false;
    }
  }

  return true;
}

/** @typedef {(contextProvider: _ContextProvider) => void} ContextProviderHostDisconnectionCallback */
/** @typedef {(contextProvider: _ContextProvider, abortController: AbortController) => ContextProviderHostDisconnectionCallback} ContextProviderHostConnectionCallback */

/** @typedef {(contextConsumer: _ContextConsumer) => void} ContextConsumerHostDisconnectionCallback */
/** @typedef {(contextConsumer: _ContextConsumer, abortController: AbortController) => ContextConsumerHostDisconnectionCallback} ContextConsumerHostConnectionCallback */

class _ContextProvider extends ContextProvider {
  /** @type {ContextProviderHostConnectionCallback?} */
  _hostConnectionCallback;
  /** @type {ContextProviderHostDisconnectionCallback?} */
  _hostDisconnectionCallback;

  hostConnected() {
    super.hostConnected();
    // console.log("hostConnected");
    this._connectionAbortController = new AbortController();
    this._hostDisconnectionCallback = this._hostConnectionCallback?.(
      this,
      this._connectionAbortController,
    );
  }
  hostDisconnected() {
    // console.log("hostDisconnected");
    this._connectionAbortController?.abort();
    this._connectionAbortController = undefined;
    this._hostDisconnectionCallback?.(this);
  }
}
class _ContextConsumer extends ContextConsumer {
  /** @type {ContextConsumerHostConnectionCallback?} */
  _hostConnectionCallback;
  /** @type {ContextConsumerHostDisconnectionCallback?} */
  _hostDisconnectionCallback;

  hostConnected() {
    super.hostConnected();
    // console.log("hostConnected");
    this._connectionAbortController = new AbortController();
    this._hostDisconnectionCallback = this._hostConnectionCallback?.(
      this,
      this._connectionAbortController,
    );
  }
  hostDisconnected() {
    super.hostDisconnected();
    // console.log("hostDisconnected");
    this._connectionAbortController.abort();
    this._connectionAbortController = undefined;
    this._hostDisconnectionCallback?.(this);
  }
}

/** @typedef {(state: any) => string} StringifyContextState */
/** @typedef {(serializedState: string) => any} ParseContextState */

/**
 * @param {string} key
 * @param {any?} defaultState
 * @param {ContextProviderHostConnectionCallback?} providerHostConnectionCallback
 * @param {ContextConsumerHostConnectionCallback?} consumerHostConnectionCallback
 * @param {boolean?} saveToLocalStorage
 * @param {StringifyContextState?} stringifyState
 * @param {ParseContextState?} parseState
 */
export function createContext(
  key,
  defaultState,
  providerHostConnectionCallback,
  consumerHostConnectionCallback,
  saveToLocalStorage,
  stringifyState,
  parseState,
) {
  const contextKey = `${key}-context`;
  const contextSymbol = Symbol(contextKey);
  const context = litContext.createContext(contextSymbol);

  let parsedState = {};
  const localStorageKey = contextKey;
  if (saveToLocalStorage) {
    const stringifiedState = localStorage.getItem(localStorageKey);
    if (stringifiedState) {
      // console.log({ localStorageKey, stringifiedState });
      try {
        parsedState = parseState
          ? parseState(stringifiedState)
          : JSON.parse(stringifiedState);
        // console.log(`parsedState for "${key}"`, parsedState);
      } catch (error) {
        console.error(
          `failed to parse stringifiedState for "${key}"`,
          { stringifiedState },
          error,
        );
      }
    }
  }

  /**
   * @param {import("lit").LitElement} host
   * @param {any?} state
   * @param {((state: any, oldState: any) => void)?} callback
   */
  const createContextProvider = (host, state, callback) => {
    // console.log("createContextProvider", host, state, callback);
    const value = {
      state: { ...defaultState, ...state, ...parsedState },
      update: (newState, force) => {
        // console.log("update", newState);
        const oldState = value.state;
        if (!force && deepEqual(newState, oldState)) {
          return;
        }
        value.state = newState;
        callback?.(newState, oldState);
        // console.log("updating provider", provider, value);
        provider.setValue(value, true);

        if (saveToLocalStorage) {
          const stringifiedState = stringifyState
            ? stringifyState(newState)
            : JSON.stringify(newState);
          // console.log({
          //   stringifiedState,
          //   state: newState,
          //   key,
          //   localStorageKey,
          // });
          localStorage.setItem(localStorageKey, stringifiedState);
        }
      },
      clearLocalStorage: () => {
        if (saveToLocalStorage) {
          console.log("clearLocalStorage", { localStorageKey });
          localStorage.removeItem(localStorageKey);
        }
      },
    };
    const provider = new _ContextProvider(host, {
      context,
      initialValue: value,
    });
    provider._hostConnectionCallback = providerHostConnectionCallback;
    return provider;
  };
  /**
   * @param {import("lit").LitElement} host
   * @param {boolean} subscribe
   * @param {(state) => void?} callback
   */
  const createContextConsumer = (host, subscribe, callback) => {
    // console.log("createContextProvider", host, { subscribe }, callback);
    const consumer = new _ContextConsumer(host, {
      context,
      subscribe,
      callback: (value) => {
        callback?.(value.state);
      },
    });
    consumer._hostConnectionCallback = consumerHostConnectionCallback;
    return consumer;
  };
  return { createContextProvider, createContextConsumer };
}
