import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./NavButton.js";

class NavButtonDevices extends LitElement {
  render() {
    return html`<bw-nav-button
      href="/devices"
      icon-name="bluetooth"
      icon-family="brands"
      variant="brand"
    >
      Devices
    </bw-nav-button>`;
  }
}
customElements.define("bw-nav-button-devices", NavButtonDevices);
