import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./NavButton.js";

class NavButtonLayers extends LitElement {
  render() {
    return html`<bw-nav-button
      href="/layers"
      icon-name="window-restore"
      variant="success"
    >
      Layers
    </bw-nav-button>`;
  }
}
customElements.define("bw-nav-button-layers", NavButtonLayers);
