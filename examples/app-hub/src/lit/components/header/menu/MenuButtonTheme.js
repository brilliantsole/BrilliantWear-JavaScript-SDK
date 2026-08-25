import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
import {
  createThemeContextConsumer,
  getTheme,
} from "../../../contexts/themeContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../HeaderButton.js";

class MenuButtonTheme extends LitElement {
  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this._themeConsumer = createThemeContextConsumer(
      this,
      true,
      (themeState) => {
        this.theme = getTheme(themeState);
      },
    );
  }

  /** @type {import("../../contexts/themeContext.js").ThemeContextState} */
  get themeState() {
    return this._themeConsumer.value.state;
  }
  /** @type {import("../../contexts/themeContext.js").ThemeContextValue} */
  theme;
  get isDarkTheme() {
    return this.theme == "dark";
  }

  toggleTheme() {
    this.themeState.selectedTheme = this.isDarkTheme ? "light" : "dark";
    this._themeConsumer.value.update(this.themeState, true);
  }

  onClick() {
    this.toggleTheme();
  }

  render() {
    return html`<bw-header-button
      icon-name=${this.isDarkTheme ? "moon" : "sun"}
      variant="neutral"
      @click=${this.onClick}
      label=${this.isDarkTheme ? "enable light theme" : "enable dark theme"}
    >
    </bw-header-button>`;
  }
}
customElements.define("bw-menu-button-theme", MenuButtonTheme);
