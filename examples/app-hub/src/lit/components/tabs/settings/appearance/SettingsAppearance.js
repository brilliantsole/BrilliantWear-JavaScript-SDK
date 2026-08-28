import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./SettingsThemeToggle.js";
import "./SettingsViewTransitionsToggle.js";
import "./SettingsTransitionsToggle.js";
import "./SettingsAnimationsToggle.js";

class SettingsAppearanceElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="wa-stack">
        <h3>Appearance</h3>
        <bw-settings-theme-toggle></bw-settings-theme-toggle>
        <bw-settings-view-transitions-toggle></bw-settings-view-transitions-toggle>
        <bw-settings-transitions-toggle></bw-settings-transitions-toggle>
        <bw-settings-animations-toggle></bw-settings-animations-toggle>
      </div>
    `;
  }
}

customElements.define("bw-settings-appearance", SettingsAppearanceElement);
