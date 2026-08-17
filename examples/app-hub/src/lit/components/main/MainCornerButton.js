import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit, litContext } = await waitForGlobals();
const { ContextConsumer } = litContext;

const { LitElement, html, css } = lit;

import "https://ka-f.webawesome.com/webawesome@3.11.0/components/badge/badge.js";
import "https://ka-f.webawesome.com/webawesome@3.11.0/components/button/button.js";
import "https://ka-f.webawesome.com/webawesome@3.11.0/components/icon/icon.js";

class MainCornerButton extends LitElement {
  static properties = {
    variant: {},
    appearance: {},
    iconFamily: { attribute: "icon-family" },
    iconName: { attribute: "icon-name" },
    label: {},
    name: {},
    click: { attribute: false },
    size: {},
  };

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.variant = "neutral";
    this.appearance = "fill-outlined";
    this.size = "m";
  }

  _updateViewTransitionName() {
    console.log("_updateViewTransitionName", this.name);
    this.style.viewTransitionName = `${this.name}`;
  }

  onDoubleClick(event) {
    event.preventDefault();
  }

  updated(changedProperties) {
    if (changedProperties.has("name")) {
      this._updateViewTransitionName();
    }
  }

  render() {
    console.log(this.variant, this.appearance);
    return html`
      <wa-button
        pill
        .size=${this.size}
        .variant=${this.variant}
        .appearance=${this.appearance}
        @click=${this.click}
        @dblclick=${this.onDoubleClick}
      >
        <wa-icon
          family=${this.iconFamily}
          name=${this.iconName}
          label=${this.label}
        ></wa-icon>
      </wa-button>
    `;
  }
}
customElements.define("bw-main-corner-button", MainCornerButton);
