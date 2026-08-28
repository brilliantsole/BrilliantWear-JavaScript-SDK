import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "./appearance/SettingsAppearance.js";

class SettingsTab extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="bw-grid-lanes">
        <bw-settings-appearance></bw-settings-appearance>
      </div>
    `;
  }
}

customElements.define("bw-settings-tab", SettingsTab);
