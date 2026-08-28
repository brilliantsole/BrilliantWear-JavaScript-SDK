import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/switch/switch.js";
import {
  createThemeContextConsumer,
  getTheme,
} from "../../../../contexts/themeContext.js";

class SettingsThemeToggleElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.ref = createRef();
    this._themeConsumer = createThemeContextConsumer(
      this,
      true,
      (themeState) => {
        this.theme = getTheme(themeState);
        if (this.ref.value) {
          this.ref.value.checked = this.isDarkTheme;
        }
      },
    );
  }

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
    this.themeState.selectedTheme = event.target.checked ? "dark" : "light";
    event.target.checked = this.isDarkTheme;
    this._themeConsumer.value.update(this.themeState, true);
  }

  render() {
    console.log({ isDarkTheme: this.isDarkTheme });
    return html`<wa-switch
      ${ref(this.ref)}
      ?checked=${this.isDarkTheme}
      @change=${this._onChange}
      >Dark Mode</wa-switch
    >`;
  }
}

customElements.define("bw-settings-theme-toggle", SettingsThemeToggleElement);
