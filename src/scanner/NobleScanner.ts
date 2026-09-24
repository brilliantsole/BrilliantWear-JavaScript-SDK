import BaseScanner, { ScannerEventMap } from "./BaseScanner.ts";
import { createConsole } from "../utils/Console.ts";
import { addEventListeners } from "../utils/EventUtils.ts";
import {
  serviceDataUUID,
  serviceUUIDs,
} from "../connection/bluetooth/bluetoothUUIDs.ts";
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

import { DeviceTypes } from "../InformationManager.ts";
import DeviceManager from "../DeviceManager.ts";
import { ClientConnectionType } from "../connection/BaseConnectionManager.ts";
import { DiscoveredDeviceMetadata } from "../index.ts";
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

  readonly connectionType = "noble";

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

    let deviceType;
    let ipAddress;
    let isWifiSecure;
    const { manufacturerData, serviceData } = noblePeripheral.advertisement;
    if (manufacturerData) {
      _console.log("manufacturerData", manufacturerData);
      if (manufacturerData.byteLength >= 3) {
        const deviceTypeEnum = manufacturerData.readUint8(2);
        deviceType = DeviceTypes[deviceTypeEnum];
        _console;
      }
      if (manufacturerData.byteLength >= 3 + 4) {
        ipAddress = new Uint8Array(
          manufacturerData.buffer.slice(3, 3 + 4),
        ).join(".");
        _console.log({ ipAddress });
      }
      if (manufacturerData.byteLength >= 3 + 4 + 1) {
        isWifiSecure = manufacturerData.readUint8(3 + 4) != 0;
        _console.log({ isWifiSecure });
      }
    }
    if (serviceData) {
      _console.log("serviceData", serviceData);
      const deviceTypeServiceData = serviceData.find((serviceDatum) => {
        return serviceDatum.uuid == serviceDataUUID;
      });
      _console.log("deviceTypeServiceData", deviceTypeServiceData);
      if (deviceTypeServiceData) {
        const deviceTypeEnum = deviceTypeServiceData.data.readUint8(0);
        deviceType = DeviceTypes[deviceTypeEnum];
      }
    }
    if (deviceType == undefined) {
      _console.log("skipping device - no deviceType");
      return;
    }

    const discoveredDeviceMetadata: DiscoveredDeviceMetadata = {
      name: noblePeripheral.advertisement.localName,
      bluetoothId: noblePeripheral.id,
      deviceType,
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
    super.connectToDevice(bluetoothId, connectionType);
    this.#assertValidNoblePeripheralId(bluetoothId);
    const noblePeripheral = this.#noblePeripherals[bluetoothId];
    _console.log("connecting to discoveredDevice...", bluetoothId);

    let device = DeviceManager.getAvailableDeviceByBluetoothId(
      bluetoothId,
      this.connectionType,
    );
    if (!device) {
      _console.log("creating device for discoveredDevice...", bluetoothId);
      device = this.#createDevice(noblePeripheral);
    }
    if (device.connectionManager!.type != this.connectionType) {
      device.connectionManager = this.#createConnectionManager(noblePeripheral);
    }

    const { ipAddress, isWifiSecure } =
      this.discoveredDevices[device.bluetoothId!];
    if (connectionType && connectionType != this.connectionType && ipAddress) {
      await device.connect({
        type: connectionType,
        ipAddress,
        isWifiSecure,
        reconnect: true,
      });
    } else {
      await device.connect({ type: this.connectionType, reconnect: true });
    }
  }

  async disconnectFromDevice(bluetoothId: string) {
    super.disconnectFromDevice(bluetoothId);
    this.#assertValidNoblePeripheralId(bluetoothId);

    let device = DeviceManager.getAvailableDeviceByBluetoothId(
      bluetoothId,
      this.connectionType,
    );

    if (device) {
      await device.disconnect();
    }
  }

  #createDevice(noblePeripheral: NoblePeripheral) {
    const deviceId = noblePeripheral.id;
    const device = new Device();

    const discoveredDevice = this.discoveredDevices[deviceId];
    // @ts-expect-error
    discoveredDevice._device = device;

    device.connectionManager = this.#createConnectionManager(noblePeripheral);

    return device;
  }

  #createConnectionManager(noblePeripheral: NoblePeripheral) {
    const nobleConnectionManager = new NobleConnectionManager();
    nobleConnectionManager.noblePeripheral = noblePeripheral;
    return nobleConnectionManager;
  }
}

export { NobleScanner };
export default NobleScanner.shared;
