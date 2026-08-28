import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./SettingsThemeToggle.js";
import "./SettingsAnimationsTree.js";

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/card/card.js";
import { createThemeContextConsumer } from "../../../../contexts/themeContext.js";
import { createDisableTransitionsContextConsumer } from "../../../../contexts/disableTransitionsContext.js";
import { createDisableViewTransitionsContextConsumer } from "../../../../contexts/disableViewTransitionsContext.js";

class SettingsAppearance extends LitElement {
  createRenderRoot() {
    return this;
  }

  _themeConsumer = createThemeContextConsumer(this);
  _disableTransitionsConsumer = createDisableTransitionsContextConsumer(this);
  _disableViewTransitionsConsumer =
    createDisableViewTransitionsContextConsumer(this);

  _onClearClick() {
    console.log("clear");
    this._themeConsumer.value.clear();
    this._disableTransitionsConsumer.value.clear();
    this._disableViewTransitionsConsumer.value.clear();
  }

  render() {
    return html`
      <wa-card class="card-header">
        <h3 slot="header" class="wa-heading-l">Appearance</h3>

        <div class="wa-stack wa-gap-s">
          <bw-settings-theme-toggle></bw-settings-theme-toggle>
          <bw-settings-animations-tree></bw-settings-animations-tree>
        </div>

        <wa-button
          appearance="plain"
          slot="header-actions"
          size="m"
          @click=${this._onClearClick}
        >
          <wa-icon name="rotate-left" variant="solid" label="clear"></wa-icon>
        </wa-button>
      </wa-card>
    `;
  }
}

customElements.define("bw-settings-appearance", SettingsAppearance);
