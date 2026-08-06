type ENVIRONMENT_FLAG = "__BRILLIANTWEAR__DEV__" | "__BRILLIANTWEAR__PROD__";
const __BRILLIANTWEAR__ENVIRONMENT__: ENVIRONMENT_FLAG =
  "__BRILLIANTWEAR__DEV__";

const isInProduction =
  // @ts-expect-error
  __BRILLIANTWEAR__ENVIRONMENT__ == "__BRILLIANTWEAR__PROD__";
const isInDev = __BRILLIANTWEAR__ENVIRONMENT__ == "__BRILLIANTWEAR__DEV__";

// https://github.com/flexdinesh/browser-or-node/blob/master/src/index.ts
const isInBrowser =
  typeof window !== "undefined" && typeof window?.document !== "undefined";
let isInIframe = false;
try {
  isInIframe = window.self !== window.top;
} catch {
  isInIframe = true;
}

const isInWKWebView =
  typeof window !== "undefined" &&
  typeof window?.webkit?.messageHandlers !== "undefined";

const isInNode =
  typeof process !== "undefined" && process?.versions?.node != null;

const userAgent = (isInBrowser && navigator.userAgent) || "";

let isBluetoothSupported = false;
if (isInBrowser) {
  isBluetoothSupported = Boolean(navigator.bluetooth);
} else if (isInNode) {
  isBluetoothSupported = true;
}

const isInBluefy = isInBrowser && /Bluefy/i.test(userAgent);
const isInWebBLE = isInBrowser && /WebBLE/i.test(userAgent);

const isAndroid = isInBrowser && /Android/i.test(userAgent);
const isSafari =
  isInBrowser && /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent);

const isIOS = isInBrowser && /iPad|iPhone|iPod/i.test(userAgent);
const isMac = isInBrowser && /Macintosh/i.test(userAgent);

const INSTANCE_KEY = Symbol.for("brilliantwear");
const existing = globalThis[INSTANCE_KEY];
console.log({ existing });
if (existing) {
  throw new Error(
    `Multiple instances of brilliantwear detected.\n` +
      `First loaded from: ${existing.stack}`,
  );
}
globalThis[INSTANCE_KEY] = {
  stack: new Error().stack,
};

export {
  isInDev,
  isInProduction,
  isInBrowser,
  isInIframe,
  isInWKWebView,
  isInNode,
  isAndroid,
  isInBluefy,
  isInWebBLE,
  isSafari,
  isIOS,
  isMac,
  isBluetoothSupported,
};
