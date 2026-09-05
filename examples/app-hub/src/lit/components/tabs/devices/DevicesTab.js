import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
import { createBluetoothContextConsumer } from "../../../contexts/bluetoothContext.js";

const { lit, BW } = await waitForGlobals();

const { LitElement, html } = lit;

import "./AddDeviceButton.js";

class DevicesTab extends LitElement {
  createRenderRoot() {
    return this;
  }

  _bluetoothConsumer = createBluetoothContextConsumer(this, true);
  /** @type {import("../../../contexts/bluetoothContext.js").BluetoothContextState} */
  get bluetoothState() {
    return this._bluetoothConsumer.value.state;
  }
  get isBluetoothEnabled() {
    return this.bluetoothState.isEnabled;
  }

  render() {
    return html`
      <p data-bluetooth-not-available-only>Bluetooth is not available</p>
      <p data-bluetooth-available-only data-bluetooth-not-enabled-only>
        Bluetooth is not enabled
      </p>

      <bw-add-device-button data-landscape-only></bw-add-device-button>

      <div class="bw-overlay">
        <div
          data-main-align="start"
          data-cross-align="start"
          data-tab-view-transition
          data-portrait-only
        >
          <bw-add-device-button></bw-add-device-button>
        </div>
      </div>
    `;
  }
}

customElements.define("bw-devices-tab", DevicesTab);
