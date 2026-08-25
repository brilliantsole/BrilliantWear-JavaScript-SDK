import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
import {
  createThemeContextConsumer,
  getTheme,
} from "../../contexts/themeContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./MainCornerButton.js";

class MainCornerButtonToggleTheme extends LitElement {
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
    return html`<bw-main-corner-button
      icon-name=${this.isDarkTheme ? "moon" : "sun"}
      label=${this.isDarkTheme ? "enable light theme" : "enable dark theme"}
      @click="${this.onClick}"
    >
    </bw-main-corner-button>`;
  }
}
customElements.define(
  "bw-main-corner-button-toggle-theme",
  MainCornerButtonToggleTheme,
);
