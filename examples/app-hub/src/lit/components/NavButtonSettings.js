import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";
const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./NavButton.js";

class NavButtonSettings extends LitElement {
  render() {
    return html`<bw-nav-button
      href="/settings"
      icon-name="gear"
      variant="neutral"
    >
      Settings
    </bw-nav-button>`;
  }
}
customElements.define("bw-nav-button-settings", NavButtonSettings);
