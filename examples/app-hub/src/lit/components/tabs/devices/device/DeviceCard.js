import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, BW, litSignals, litRepeat, litStyleMap } = await waitForGlobals();
const { SignalWatcher, signal } = litSignals;
const { repeat } = litRepeat;
const { styleMap } = litStyleMap;

const { LitElement, html, nothing } = lit;

/** @typedef {import("../../../../../../../../build/brilliantwear.module.js").EventDispatcherOptions} EventDispatcherOptions */
/** @typedef {import("../../../../../../../../build/brilliantwear.module.js").DeviceType} DeviceType */
/** @typedef {import("../../../../../../../../build/brilliantwear.module.js").Device} Device */
/** @typedef {import("../../../../../../../../build/brilliantwear.module.js").DiscoveredDevice} DiscoveredDevice */

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/card/card.js";

class DeviceCard extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    bluetoothId: {},
    deviceType: {},
  };

  getDevice() {
    return BW.DeviceManager.availableDevices.find(
      (device) => device.bluetoothId == this.bluetoothId,
    );
  }
  getDiscoveredDevice() {
    return BW.ScannerManager.discoveredDevices[this.bluetoothId];
  }

  /** @type {Device?} */
  _device;
  /** @param {Device} device */
  _onDevice(device) {
    if (this._device == device) {
      return;
    }
    console.log("_onDevice", device);
    this._device = device;

    if (this._deviceAbortController) {
      this._deviceAbortController.abort();
    }
    this._deviceAbortController = new AbortController();
    /** @type {EventDispatcherOptions} */
    const options = {
      signal: this._deviceAbortController.signal,
      immediate: true,
    };

    this._device.addEventListener(
      "getType",
      () => {
        this.deviceType = this._device.type;
      },
      options,
    );
  }
  /** @type {DiscoveredDevice?} */
  _discoveredDevice;
  /** @param {DiscoveredDevice} discoveredDevice */
  _onDiscoveredDevice(discoveredDevice) {
    if (this._discoveredDevice == discoveredDevice) {
      return;
    }
    console.log("_onDiscoveredDevice", discoveredDevice);
    this._discoveredDevice = discoveredDevice;

    if (this._discoveredDeviceAbortController) {
      this._discoveredDeviceAbortController.abort();
    }
    this._discoveredDeviceAbortController = new AbortController();
    /** @type {AddEventListenerOptions} */
    const options = { signal: this._discoveredDeviceAbortController.signal };

    this._discoveredDevice.addEventListener(
      "deviceType",
      () => {
        this.deviceType = this._discoveredDevice.deviceType;
      },
      options,
    );
  }

  connectedCallback() {
    super.connectedCallback();

    this._abortController = new AbortController();
    /** @type {AddEventListenerOptions} */
    const options = { signal: this._abortController.signal };

    const device = this.getDevice();
    this._onDevice(device);

    const discoveredDevice = this.getDiscoveredDevice();
    this._onDiscoveredDevice(discoveredDevice);

    BW.ScannerManager.addEventListener(
      "scannerDiscoveredDevice",
      (event) => {
        const { discoveredDevice } = event.message;
        if (discoveredDevice.bluetoothId == this.bluetoothId) {
          this._onDiscoveredDevice(discoveredDevice);
        }
      },
      options,
    );

    BW.DeviceManager.addEventListener(
      "availableDevice",
      (event) => {
        const { device } = event.message;
        if (device.bluetoothId == this.bluetoothId) {
          this._onDevice(device);
        }
      },
      options,
    );
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._abortController.abort();
    this._discoveredDeviceAbortController?.abort();
    this._deviceAbortController?.abort();
  }

  get rssi() {
    return this._discoveredDevice?.rssi;
  }

  /** @type {DeviceType} */
  get _deviceType() {
    return this.deviceType;
  }

  renderIcon() {
    const deviceType = "generic" ?? this._deviceType;
    switch (deviceType) {
      case "leftInsole":
      case "rightInsole":
        return html`<wa-icon
          src="./assets/icons/shoe.svg"
          style="font-size: 0.8rem;"
          flip=${deviceType == "leftInsole" ? "x" : ""}
        ></wa-icon>`;
        break;
      case "leftGlove":
      case "rightGlove":
        return html`<wa-icon
          name="hand"
          variant="regular"
          style="font-size: 1rem;"
          flip=${deviceType == "leftGlove" ? "x" : ""}
        ></wa-icon>`;
        break;
      case "glasses":
        return html`<wa-icon name="glasses"></wa-icon>`;
        break;
      case "generic":
        return html`<wa-icon
          name="circle-question"
          variant="regular"
        ></wa-icon>`;
        break;
      default:
        console.error(`uncaught deviceType "${this._deviceType}"`);
        return nothing;
    }
  }

  render() {
    return html`<wa-card>
      <div class="wa-stack wa-gap-xs">
        <div class="wa-cluster wa-gap-xs">
          <div>${this.renderIcon()}</div>
          <div>${"Name"}</div>
        </div>
        <div class="wa-cluster wa-gap-xs"></div>
        <div>Connect/Disconnect</div>
      </div>
    </wa-card>`;
  }
}
// <wa-button appearance="filled">Name</wa-button>

customElements.define("bw-device-card", DeviceCard);
