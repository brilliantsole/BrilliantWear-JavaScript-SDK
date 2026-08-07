import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit, litContext, keyed } = await waitForGlobals();
const { ContextConsumer } = litContext;

const { LitElement, html, css } = lit;

import "https://ka-f.webawesome.com/webawesome@3.11.0/components/badge/badge.js";
import "https://ka-f.webawesome.com/webawesome@3.11.0/components/button/button.js";
import "https://ka-f.webawesome.com/webawesome@3.11.0/components/icon/icon.js";
import { activeTabContext } from "../../contexts/activeTabContext.js";
import { screenOrientationContext } from "../../contexts/screenOrientationContext.js";
import { isIOS, isTouch } from "../../../utils/environment.js";

class NavButton extends LitElement {
  static properties = {
    href: {},
    variant: {},
    iconFamily: { attribute: "icon-family" },
    iconName: { attribute: "icon-name" },
    isActive: { type: Boolean },
    pill: { type: Boolean },
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
  `;

  constructor() {
    super();
    this.pill = true;
    this.isActive = false;
    this._activeTabConsumer = new ContextConsumer(this, {
      context: activeTabContext,
      subscribe: true,
      callback: async (activeTab) => {
        const isActive = `/${this._activeTabConsumer.value}` == this.href;
        // console.log({ isActive }, this.href);
        this.isActive = isActive;
      },
    });
    this._screenOrientationConsumer = new ContextConsumer(this, {
      context: screenOrientationContext,
      subscribe: true,
      /** @param {ScreenOrientation} screenOrientation */
      callback: async (screenOrientation) => {
        this.pill = screenOrientation.type.includes("landscape") && isTouch;
        // console.log("this.pill", this.pill);
      },
    });
  }

  render() {
    // console.log("render", { isActive: this.isActive }, this);
    const _html = html`<wa-button
      ?pill=${this.pill}
      size="l"
      .variant=${this.variant}
      .appearance=${this.isActive ? "accent" : "plain"}
      href=${this.href}
    >
      <div class="wa-align-items-center wa-stack wa-gap-2xs">
        <wa-icon family=${this.iconFamily} name=${this.iconName}></wa-icon>
        <span class="wa-font-size-xs"><slot></slot></span>
      </div>
    </wa-button>`;

    if (isIOS) {
      return html` ${keyed(this.isActive, _html)} `;
    } else {
      return _html;
    }
  }
}
customElements.define("bw-nav-button", NavButton);
