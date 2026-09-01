import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "../SettingsCard.js";

class SettingsActionButtons extends LitElement {
  clear() {
    console.log("clear action buttons settings");
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bw-settings-card label="Action Buttons" @clear=${this.clear}>
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-action-buttons", SettingsActionButtons);
