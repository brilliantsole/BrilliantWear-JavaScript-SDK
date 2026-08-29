import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "../SettingsCard.js";

import "./SettingsFullscreenToggle.js";

class SettingsInterface extends LitElement {
  // FILL - consumers

  clear() {
    console.log("clear interface settings");
    // FILL
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bw-settings-card label="Interface" @clear=${this.clear}>
        <bw-settings-fullscreen-toggle switch></bw-settings-fullscreen-toggle>
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-interface", SettingsInterface);
