import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";
const { litSignals, BW } = await waitForGlobals();
const { signal } = litSignals;

/** @type {import("@lit-labs/signals").Signal.State<Boolean>} */
export const isScanningSignal = signal(false);

/** @type {import("@lit-labs/signals").Signal.State<Boolean>} */
export const isScanningAvailableSignal = signal(false);

/** @typedef {import("../../../../../../../../build/brilliantwear.module.js").BaseScanner} Scanner */

/** @type {AbortController?} */
let scannerAbortController;
/** @param {Scanner} scanner */
const onScanner = (scanner) => {
  if (scannerAbortController) {
    scannerAbortController.abort();
  }
  scannerAbortController = new AbortController();
  const options = { immediate: true, signal: scannerAbortController.signal };

  scanner.addEventListener(
    "isScanningAvailable",
    () => {
      console.log("scanner.isScanningAvailable", scanner.isScanningAvailable);
      isScanningAvailableSignal.set(scanner.isScanningAvailable);
    },
    options,
  );
  scanner.addEventListener(
    "isScanning",
    () => {
      console.log("scanner.isScanning", scanner.isScanning);
      isScanningSignal.set(scanner.isScanning);
    },
    options,
  );

  scannerSignal.set(scanner);
};

/** @type {import("@lit-labs/signals").Signal.State<Scanner?>} */
export const scannerSignal = signal();

BW.ScannerManager.addEventListener(
  "scanner",
  (event) => {
    const scanner = BW.ScannerManager.scanners.find(
      (scanner) => !scanner.isClient && scanner.connectionType != "none",
    );
    if (!scanner) {
      return;
    }
    onScanner(scanner);
  },
  { immediate: true },
);
