import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/switch/switch.js";

import {
  createThemeContextConsumer,
  getTheme,
} from "../../../../contexts/themeContext.js";

class SettingsThemeToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

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

  render() {
    console.log({ isDarkTheme: this.isDarkTheme });
    return html`<wa-switch
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      >Dark Mode</wa-switch
    >`;
  }
}

customElements.define("bw-settings-theme-toggle", SettingsThemeToggle);
