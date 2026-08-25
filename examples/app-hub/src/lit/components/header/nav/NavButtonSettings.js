import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../HeaderButton.js";

class NavButtonSettings extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<bw-header-button
      href="/settings"
      icon-name="gear"
      variant="neutral"
    >
      Settings
    </bw-header-button>`;
  }
}
customElements.define("bw-nav-button-settings", NavButtonSettings);
