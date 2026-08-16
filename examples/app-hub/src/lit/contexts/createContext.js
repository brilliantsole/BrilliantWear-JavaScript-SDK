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

/** @typedef {(state: any) => any} SerializeContextState */
/** @typedef {(serializedState: any) => any} ParseContextState */

/** @typedef {(serializedState: any) => Promise<boolean>} SaveContextState */
/** @typedef {() => Promise<any?>} LoadContextState */
/** @typedef {() => Promise<boolean>} ClearContextState */

/** @typedef {(newValue: boolean, oldValue: boolean) => boolean} HasContextStateChangedCallback */

/** @typedef {"localStorage" | "sessionStorage"} ContextStorageType */

/**
 * @typedef {Object} CreateContextOptions
 * @property {any?} defaultState
 * @property {ContextProviderHostConnectionCallback?} onProviderHostConnection
 * @property {ContextConsumerHostConnectionCallback?} onConsumerHostConnection
 * @property {ContextStorageType?} storageType
 * @property {SerializeContextState?} serialize
 * @property {ParseContextState?} parse
 * @property {SaveContextState?} save
 * @property {LoadContextState?} load
 * @property {ClearContextState?} clear
 * @property {HasContextStateChangedCallback?} hasChanged
 */

/**
 * @param {string} key
 * @param {CreateContextOptions} options
 */
export async function createContext(key, options) {
  const contextKey = `${key}-context`;
  const contextSymbol = Symbol(contextKey);
  const context = litContext.createContext(contextSymbol);
  const storageKey = contextKey;

  options = options ?? {};
  const { storageType, onConsumerHostConnection, onProviderHostConnection } =
    options;
  let { load, save, parse, serialize, hasChanged, clear, defaultState } =
    options;

  defaultState = defaultState ?? {};

  parse = parse ?? JSON.parse.bind(JSON);
  serialize = serialize ?? JSON.stringify.bind(JSON);
  hasChanged = hasChanged ?? deepEqual;

  if (options?.storageType) {
    switch (options.storageType) {
      case "localStorage":
        load = async () => {
          return localStorage.getItem(storageKey);
        };
        save = async (serializedState) => {
          localStorage.setItem(storageKey, serializedState);
          return true;
        };
        clear = async () => {
          localStorage.removeItem(storageKey);
          return true;
        };
        break;
      case "sessionStorage":
        load = async () => {
          return sessionStorage.getItem(storageKey);
        };
        save = async (serializedState) => {
          sessionStorage.setItem(storageKey, serializedState);
          return true;
        };
        clear = async (serializedState) => {
          sessionStorage.removeItem(storageKey, serializedState);
          return true;
        };
        break;
      default:
        throw Error(`uncaught storageType "${options.storageType}"`);
        break;
    }
  }

  let parsedState = {};
  if (load) {
    const serializedState = await load();
    parsedState = parse(serializedState);
    console.log({ serializedState, parsedState });
  }

  /**
   * @param {import("lit").LitElement} host
   * @param {any?} initialState
   * @param {((state: any, oldState: any) => void)?} callback
   */
  const createContextProvider = (host, initialState, callback) => {
    // console.log("createContextProvider", host, initialState, callback);
    const value = {
      state: { ...defaultState, ...initialState, ...parsedState },
      update: async (newState, force, dontSave) => {
        // console.log("update", newState);
        const oldState = value.state;
        if (!force && hasChanged(newState, oldState)) {
          return false;
        }
        value.state = newState;
        callback?.(newState, oldState);
        // console.log("updating provider", provider, value);
        provider.setValue(value, true);

        if (save && !dontSave) {
          const serializedState = serialize(newState);
          console.log({
            serializedState,
            newState,
          });
          const didSave = await save(serializedState);
          if (!didSave) {
            console.error(`failed to save "${contextKey}"`);
          }
        }
        return true;
      },
      clear: async () => {
        const didClear = await clear();
        if (!didClear) {
          console.error(`failed to clear "${contextKey}"`);
        }
        return didClear;
      },
    };

    if (options?.storageType) {
      /** @type {Storage?} */
      let storageArea;
      switch (options.storageType) {
        case "localStorage":
          storageArea = localStorage;
          break;
        case "sessionStorage":
          storageArea = sessionStorage;
          break;
      }
      if (storageArea) {
        window.addEventListener("storage", (event) => {
          if (event.key == storageKey && event.storageArea == storageArea) {
            const newState = parse(event.newValue);
            console.log(`updated "${contextKey}" from another page`, {
              newState,
              newValue: event.newValue,
            });
            value.update(newState, undefined, true);
          }
        });
      }
    }
    const provider = new _ContextProvider(host, {
      context,
      initialValue: value,
    });
    provider._hostConnectionCallback = onProviderHostConnection;
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
    consumer._hostConnectionCallback = onConsumerHostConnection;
    return consumer;
  };
  return { createContextProvider, createContextConsumer };
}
