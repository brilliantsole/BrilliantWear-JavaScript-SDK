import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "../SettingsCard.js";

class SettingsGestures extends LitElement {
  clear() {
    console.log("clear gestures settings");
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bw-settings-card label="Gestures" @clear=${this.clear}>
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-gestures", SettingsGestures);
