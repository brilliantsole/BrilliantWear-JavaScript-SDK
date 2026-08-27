import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
import { tabIcons, tabVariants } from "../../tabs/tabs.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../HeaderButton.js";

class NavButtonDevices extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    const { name, family } = tabIcons["devices"];

    return html`<bw-header-button
      href="/devices"
      icon-name=${name}
      icon-family=${family}
      variant=${tabVariants["devices"]}
    >
      Devices
    </bw-header-button>`;
  }
}
customElements.define("bw-nav-button-devices", NavButtonDevices);
