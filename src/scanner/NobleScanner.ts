import BaseScanner, { ScannerEventMap } from "./BaseScanner.ts";
import { createConsole } from "../utils/Console.ts";
import { addEventListeners } from "../utils/EventUtils.ts";
import { serviceUUIDs } from "../connection/bluetooth/bluetoothUUIDs.ts";
import Device from "../Device.ts";
import NobleConnectionManager, {
  NoblePeripheral,
} from "../connection/bluetooth/NobleConnectionManager.ts";

const _console = createConsole("NobleScanner", { log: false });

let filterManually = true;
const filterServiceUuid = (serviceUUIDs[0] as string).replaceAll("-", "");

let isLinux = false;
import noble from "@stoprocent/noble";
import os from "os";
const platform = os.platform();
isLinux = platform == "linux";
filterManually = isLinux;
_console.log({ platform, filterManually, filterServiceUuid });

import DeviceManager from "../DeviceManager.ts";
import { ClientConnectionType } from "../connection/BaseConnectionManager.ts";
import { ConnectionManager, DiscoveredDeviceMetadata } from "../index.ts";
import { Singleton } from "../utils/TypeScriptUtils.ts";

export const NobleStates = [
  "unknown",
  "resetting",
  "unsupported",
  "unauthorized",
  "poweredOff",
  "poweredOn",
] as const;
export type NobleState = (typeof NobleStates)[number];

@Singleton
class NobleScanner extends BaseScanner {
  static readonly shared: NobleScanner;

  readonly connectionType = "bluetooth";

  // NOBLE STATE
  #_nobleState: NobleState = "unknown";
  get #nobleState() {
    return this.#_nobleState;
  }
  set #nobleState(newNobleState) {
    _console.assertTypeWithError(newNobleState, "string");
    if (this.#nobleState == newNobleState) {
      _console.log("duplicate nobleState assignment");
      return;
    }
    this.#_nobleState = newNobleState;
    _console.log({ newNobleState });
    this._isScanningAvailable = this.#isScanningAvailable;
  }

  // NOBLE LISTENERS
  #boundNobleListeners = {
    scanStart: this.#onNobleScanStart.bind(this),
    scanStop: this.#onNobleScanStop.bind(this),
    stateChange: this.#onNobleStateChange.bind(this),
    discover: this.#onNobleDiscover.bind(this),
  };
  #onNobleScanStart() {
    _console.log("OnNobleScanStart");
    this._isScanning = true;
  }
  #onNobleScanStop() {
    _console.log("OnNobleScanStop");
    this._isScanning = false;
  }
  #onNobleStateChange(state: NobleState) {
    _console.log("onNobleStateChange", state);
    this.#nobleState = state;
  }
  #isBusy = false;
  async #onNobleDiscover(noblePeripheral: NoblePeripheral) {
    _console.log("advertisement", noblePeripheral.advertisement);
    if (filterManually) {
      const serviceUuid = noblePeripheral.advertisement.serviceUuids?.[0];
      _console.log("onNobleDiscover.filterManually", { serviceUuid });
      if (serviceUuid != filterServiceUuid) {
        return;
      }
    }

    _console.log("onNobleDiscover", noblePeripheral.id);
    if (!this.#noblePeripherals[noblePeripheral.id]) {
      noblePeripheral.scanner = this;
      this.#noblePeripherals[noblePeripheral.id] = noblePeripheral;
    } else {
      const _noblePeripheral = this.#noblePeripherals[noblePeripheral.id];
      if (
        isLinux &&
        _noblePeripheral.shouldConnect &&
        !this.#isBusy &&
        _noblePeripheral.state == "disconnected"
      ) {
        this.#isBusy = true;
        _noblePeripheral.shouldConnect = false;
        _console.log("noblePeripheral.connectAsync");
        // https://github.com/stoprocent/noble/pull/75
        // @ts-expect-error
        await _noblePeripheral.connectAsync({ mtu: 512 });
        _console.log("noblePeripheral.connectAsync done");
        this.#isBusy = false;
      }
    }

    _console.log("advertisement", noblePeripheral.advertisement);

    const { manufacturerData } = noblePeripheral.advertisement;
    _console.log("manufacturerData", manufacturerData);
    const { deviceType, ipAddress, isWifiSecure } = this._parseManufacturerData(
      new DataView(manufacturerData.buffer),
    );

    const discoveredDeviceMetadata: DiscoveredDeviceMetadata = {
      name: noblePeripheral.advertisement.localName,
      bluetoothId: noblePeripheral.id,
      deviceType: deviceType!,
      rssi: noblePeripheral.rssi,
      ipAddress,
      isWifiSecure,
    };
    this._onDiscoveredDevice(discoveredDeviceMetadata);
  }

  // CONSTRUCTOR
  constructor() {
    super();
    addEventListeners(noble, this.#boundNobleListeners);
    addEventListeners(this, this.#boundBaseScannerListeners);
  }

  // AVAILABILITY
  get #isScanningAvailable() {
    return this.#nobleState == "poweredOn";
  }

  // SCANNING
  startScan() {
    if (!super.startScan()) {
      return false;
    }
    _console.log("noble.startScan");
    noble.startScanningAsync(
      filterManually ? [] : (serviceUUIDs as string[]),
      true,
    );
    return true;
  }
  stopScan() {
    if (!super.stopScan()) {
      return false;
    }
    _console.log("noble.stopScan");
    noble.stopScanningAsync();
    return true;
  }

  // RESET
  get canReset() {
    return true;
  }
  reset() {
    super.reset();
    noble.reset();
  }

  // BASESCANNER LISTENERS
  #boundBaseScannerListeners = {
    expiredDiscoveredDevice: this.#onExpiredDiscoveredDevice.bind(this),
  };

  #onExpiredDiscoveredDevice(
    event: ScannerEventMap["expiredDiscoveredDevice"],
  ) {
    const { discoveredDevice } = event.message;
    const noblePeripheral =
      this.#noblePeripherals[discoveredDevice.bluetoothId];
    if (noblePeripheral) {
      // disconnect?
      delete this.#noblePeripherals[discoveredDevice.bluetoothId];
    }
  }

  // DISCOVERED DEVICES
  #noblePeripherals: { [bluetoothId: string]: NoblePeripheral } = {};
  #assertValidNoblePeripheralId(noblePeripheralId: string) {
    _console.assertTypeWithError(noblePeripheralId, "string");
    _console.assertWithError(
      this.#noblePeripherals[noblePeripheralId],
      `no noblePeripheral found with id "${noblePeripheralId}"`,
    );
  }

  // DEVICES
  async connectToDevice(
    bluetoothId: string,
    connectionType?: ClientConnectionType,
  ) {
    this.#assertValidNoblePeripheralId(bluetoothId);
    await super.connectToDevice(bluetoothId, connectionType);
  }
  async disconnectFromDevice(bluetoothId: string) {
    this.#assertValidNoblePeripheralId(bluetoothId);
    await super.disconnectFromDevice(bluetoothId);
  }

  _createConnectionManager(bluetoothId: string) {
    const noblePeripheral = this.#noblePeripherals[bluetoothId];
    const nobleConnectionManager = new NobleConnectionManager();
    nobleConnectionManager.noblePeripheral = noblePeripheral;
    return nobleConnectionManager;
  }
}

export { NobleScanner };
export default NobleScanner.shared;
