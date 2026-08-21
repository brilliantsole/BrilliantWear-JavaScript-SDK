import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

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
    click: { attribute: false },
    label: {},
    size: {},
  };

  createRenderRoot() {
    return this;
  }

  constructor() {
    super();
    this.pill = true;
    this.appearance = "accent";
    this.variant = "neutral";
    this.size = "xs";
  }

  render() {
    return html`
      <wa-button
        ?pill=${this.pill}
        .size=${this.size}
        .variant=${this.variant}
        .appearance=${this.appearance}
        @click=${this.click}
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
