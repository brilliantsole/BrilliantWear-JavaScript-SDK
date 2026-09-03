import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit, BW } = await waitForGlobals();

const { LitElement, html } = lit;

import "./AddDeviceButton.js";

class DevicesTab extends LitElement {
  createRenderRoot() {
    return this;
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
        >
          <bw-add-device-button></bw-add-device-button>
        </div>
      </div>
    `;
  }
}

customElements.define("bw-devices-tab", DevicesTab);
