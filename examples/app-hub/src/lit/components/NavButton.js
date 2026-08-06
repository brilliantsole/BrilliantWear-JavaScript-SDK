import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { lit, litContext } = await waitForGlobals();
const { ContextConsumer } = litContext;

const { LitElement, html, css } = lit;

import "https://ka-f.webawesome.com/webawesome@3.11.0/components/badge/badge.js";
import "https://ka-f.webawesome.com/webawesome@3.11.0/components/button/button.js";
import "https://ka-f.webawesome.com/webawesome@3.11.0/components/icon/icon.js";
import { selectedTabContext } from "../contexts/selectedTabContext.js";

class NavButton extends LitElement {
  static properties = {
    href: {},
    variant: {},
    iconFamily: { attribute: "icon-family" },
    iconName: { attribute: "icon-name" },
  };

  static styles = css`
    [class*="wa-stack"] {
      display: flex;
      flex-direction: column;
    }
    .wa-gap-2xs {
      gap: var(--wa-space-2xs);
    }
    .wa-align-items-center {
      align-items: center;
    }
    .wa-font-size-xs {
      font-size: var(--wa-font-size-xs);
    }
  `;

  constructor() {
    super();
    this._selectedTabConsumer = new ContextConsumer(this, {
      context: selectedTabContext,
      subscribe: true,
    });
  }

  get isSelected() {
    // console.log("isSelected", this.href, this._selectedTabConsumer.value);
    return `/${this._selectedTabConsumer.value}` == this.href;
  }

  render() {
    return html`<wa-button
      pill
      size="l"
      variant="${this.variant}"
      appearance=${this.isSelected ? "accent" : "plain"}
      href=${this.href}
    >
      <div class="wa-align-items-center wa-stack wa-gap-2xs">
        <wa-icon family=${this.iconFamily} name=${this.iconName}></wa-icon>
        <span class="wa-font-size-xs"><slot></slot></span>
      </div>
    </wa-button>`;
  }
}
customElements.define("bw-nav-button", NavButton);
