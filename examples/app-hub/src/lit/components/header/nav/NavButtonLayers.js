import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../HeaderButton.js";

class NavButtonLayers extends LitElement {
  render() {
    return html`<bw-header-button
      href="/layers"
      icon-name="window-restore"
      variant="success"
    >
      Layers
    </bw-header-button>`;
  }
}
customElements.define("bw-nav-button-layers", NavButtonLayers);
