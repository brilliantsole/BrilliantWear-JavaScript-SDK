import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/badge/badge.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/button/button.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/icon/icon.js";

import { createActiveTabContextConsumer } from "../../contexts/activeTabContext.js";
import { createScreenOrientationContextConsumer } from "../../contexts/screenOrientationContext.js";
import { createTouchEnabledContextConsumer } from "../../contexts/touchEnabledContext.js";

class NavButton extends LitElement {
  static properties = {
    href: {},
    variant: {},
    iconFamily: { attribute: "icon-family" },
    iconName: { attribute: "icon-name" },
    isActive: { type: Boolean },
    click: { attribute: false },
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

    wa-button {
      -webkit-touch-callout: none;
    }
    wa-button::part(button) {
      padding: 0
        calc(var(--wa-form-control-padding-inline) - var(--wa-space-3xs));
    }
  `;

  get touchEnabled() {
    return this._touchEnabledConsumer.value.state.touchEnabled;
  }

  constructor() {
    super();
    this.pill = true;
    this.isActive = false;
    this._activeTabConsumer = createActiveTabContextConsumer(
      this,
      true,
      ({ activeTab }) => {
        const isActive = `/${activeTab}` == this.href;
        // console.log({ isActive }, this.href);
        this.isActive = isActive;
      },
    );
    this._touchEnabledConsumer = createTouchEnabledContextConsumer(this, true);
    this._screenOrientationConsumer = createScreenOrientationContextConsumer(
      this,
      true,
    );
  }

  render() {
    const pill =
      this._screenOrientationConsumer.value.state.type.includes("landscape") &&
      this.touchEnabled;
    // console.log("render", { isActive: this.isActive }, this);
    return html`<wa-button
      ?pill=${pill}
      size="l"
      .variant=${this.variant}
      .appearance=${this.isActive ? "accent" : "plain"}
      .href=${this.href}
      @click=${this.click}
    >
      <div class="wa-align-items-center wa-stack wa-gap-2xs">
        <wa-icon family=${this.iconFamily} name=${this.iconName}></wa-icon>
        <span class="wa-font-size-xs"><slot></slot></span>
      </div>
    </wa-button>`;
  }
}
customElements.define("bw-nav-button", NavButton);
