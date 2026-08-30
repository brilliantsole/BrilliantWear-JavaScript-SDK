import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import {
  createThemeContextConsumer,
  getTheme,
} from "../../../../contexts/themeContext.js";
import {
  createFullscreenContextConsumer,
  getIsFullscreen,
  toggleFullscreen,
} from "../../../../contexts/fullscreenContext.js";

class SettingsFullscreenToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  _fullscreenConsumer = createFullscreenContextConsumer(this, true, () => {
    if (this.ref.value) {
      this.ref.value.checked = this.checked;
    }
  });

  _onChange(event) {
    const { checked } = event.target;
    toggleFullscreen(checked);
  }

  get checked() {
    return getIsFullscreen();
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Fullscreen"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-fullscreen-toggle",
  SettingsFullscreenToggle,
);
