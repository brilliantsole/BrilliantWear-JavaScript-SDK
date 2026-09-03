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
      <div class="bw-overlay">
        <bw-add-device-button></bw-add-device-button>

        <div
          data-main-align="start"
          data-cross-align="end"
          data-tab-view-transition
        ></div>
      </div>
    `;
  }
}

customElements.define("bw-devices-tab", DevicesTab);
