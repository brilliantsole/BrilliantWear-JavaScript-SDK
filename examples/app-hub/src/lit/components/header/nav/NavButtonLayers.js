import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
import { tabIcons, tabVariants } from "../../tabs/tabs.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../HeaderButton.js";

class NavButtonLayers extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    const { name } = tabIcons["layers"];

    return html`<bw-header-button
      href="/layers"
      icon-name=${name}
      variant=${tabVariants["layers"]}
    >
      Layers
    </bw-header-button>`;
  }
}
customElements.define("bw-nav-button-layers", NavButtonLayers);
