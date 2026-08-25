import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../HeaderButton.js";

class NavButtonDevices extends LitElement {
  render() {
    return html`<bw-header-button
      href="/devices"
      icon-name="bluetooth"
      icon-family="brands"
      variant="brand"
    >
      Devices
    </bw-header-button>`;
  }
}
customElements.define("bw-nav-button-devices", NavButtonDevices);
