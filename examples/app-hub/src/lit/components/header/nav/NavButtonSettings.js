import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
import { tabIcons, tabVariants } from "../../tabs/tabs.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../HeaderButton.js";

class NavButtonSettings extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    const { name } = tabIcons["settings"];

    return html`<bw-header-button
      href="/settings"
      icon-name=${name}
      variant=${tabVariants["settings"]}
    >
      Settings
    </bw-header-button>`;
  }
}
customElements.define("bw-nav-button-settings", NavButtonSettings);
