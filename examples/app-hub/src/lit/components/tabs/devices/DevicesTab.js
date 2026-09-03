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
      <div>
        <bw-add-device-button></bw-add-device-button>
      </div>
    `;
  }
}

customElements.define("bw-devices-tab", DevicesTab);
