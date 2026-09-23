import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, nothing } = lit;

import "../SettingsCard.js";

import "./SettingsFullscreenToggle.js";
import "./SettingsThemeToggle.js";
import "./animations/SettingsAnimationsTree.js";

import { createThemeContextConsumer } from "../../../../contexts/themeContext.js";
import { createDisableTransitionsContextConsumer } from "../../../../contexts/disableTransitionsContext.js";
import { createDisableViewTransitionsContextConsumer } from "../../../../contexts/disableViewTransitionsContext.js";
import {
  createFullscreenContextConsumer,
  exitFullscreen,
} from "../../../../contexts/fullscreenContext.js";

class SettingsAppearance extends LitElement {
  _themeConsumer = createThemeContextConsumer(this);
  _disableTransitionsConsumer = createDisableTransitionsContextConsumer(this);
  _disableViewTransitionsConsumer =
    createDisableViewTransitionsContextConsumer(this);
  _fullscreenConsumer = createFullscreenContextConsumer(this);

  clear() {
    console.log("clear appearance settings");
    this._themeConsumer.value.clear();
    this._disableTransitionsConsumer.value.clear();
    this._disableViewTransitionsConsumer.value.clear();
    exitFullscreen();
  }

  /** @type {import("../../../../contexts/fullscreenContext.js").FullscreenContextState} */
  get fullscreenState() {
    return this._fullscreenConsumer.value.state;
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bw-settings-card label="Appearance" @clear=${this.clear}>
        ${this.fullscreenState.fullscreenEnabled
          ? html`<bw-settings-fullscreen-toggle
              switch
            ></bw-settings-fullscreen-toggle>`
          : nothing}
        <bw-settings-theme-toggle switch></bw-settings-theme-toggle>
        <bw-settings-animations-tree></bw-settings-animations-tree>
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-appearance", SettingsAppearance);
