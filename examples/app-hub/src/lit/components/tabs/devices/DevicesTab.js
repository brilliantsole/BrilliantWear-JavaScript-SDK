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
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>
      <h1>Hello</h1>

      <div class="bw-overlay">
        <div
          data-main-align="start"
          data-cross-align="start"
          data-tab-view-transition
          data-portrait-only
        >
          <bw-add-device-button
            data-bluetooth-available-only
          ></bw-add-device-button>
        </div>
      </div>
    `;
  }
}

customElements.define("bw-devices-tab", DevicesTab);
