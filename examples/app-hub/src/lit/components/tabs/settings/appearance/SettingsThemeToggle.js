import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/switch/switch.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/checkbox/checkbox.js";

import {
  createThemeContextConsumer,
  getTheme,
} from "../../../../contexts/themeContext.js";

class SettingsThemeToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean, reflect: true },
  };

  ref = createRef();
  _themeConsumer = createThemeContextConsumer(this, true, (themeState) => {
    this.theme = getTheme(themeState);
    if (this.ref.value) {
      this.ref.value.checked = this.checked;
    }
  });

  /** @type {import("../../../../contexts/themeContext.js").ThemeContextState} */
  get themeState() {
    return this._themeConsumer.value.state;
  }
  /** @type {import("../../../../contexts/themeContext.js").ThemeContextValue} */
  theme;
  get isDarkTheme() {
    return this.theme == "dark";
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.themeState.selectedTheme = checked ? "dark" : "light";
    this._themeConsumer.value.update(this.themeState, true);
  }

  get checked() {
    return this.isDarkTheme;
  }

  _label = "Dark Mode";

  render() {
    if (this.switch) {
      return html`<wa-switch
        ${ref(this.ref)}
        ?checked=${this.checked}
        @change=${this._onChange}
        >${this._label}</wa-switch
      >`;
    } else {
      return html`<wa-checkbox
        ${ref(this.ref)}
        ?checked=${this.checked}
        @change=${this._onChange}
        >${this._label}</wa-checkbox
      >`;
    }
  }
}

customElements.define("bw-settings-theme-toggle", SettingsThemeToggle);
