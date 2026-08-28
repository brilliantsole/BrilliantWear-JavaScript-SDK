import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./SettingsThemeToggle.js";
import "./SettingsAnimationsTree.js";

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/card/card.js";

class SettingsAppearance extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <wa-card class="card-header">
        <h3 slot="header" class="wa-heading-l">Appearance</h3>

        <div class="wa-stack wa-gap-s">
          <bw-settings-theme-toggle></bw-settings-theme-toggle>
          <bw-settings-animations-tree></bw-settings-animations-tree>
        </div>

        <wa-button appearance="plain" slot="header-actions" size="m">
          <wa-icon
            name="rotate-left"
            variant="solid"
            label="reset settings"
          ></wa-icon>
        </wa-button>
      </wa-card>
    `;
  }
}

customElements.define("bw-settings-appearance", SettingsAppearance);
