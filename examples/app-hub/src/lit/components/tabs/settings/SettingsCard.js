import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/card/card.js";

class SettingsCard extends LitElement {
  static properties = {
    label: {},
  };

  static styles = css`
    .bw-grid-lanes {
      grid-template-columns: repeat(auto-fill, 200px);

      @supports (display: grid-lanes) {
        display: grid-lanes;
      }
      @supports not (display: grid-lanes) {
        display: grid;
      }
      @supports (grid-template-rows: masonry) {
        grid-template-rows: masonry;
      }

      row-gap: var(--wa-space-xs);
      column-gap: var(--wa-space-xs);

      justify-items: start;
      direction: var(--hand-direction);
    }
    .bw-grid-lanes > * {
      direction: initial;
    }

    [class*="wa-stack"] {
      display: flex;
      flex-direction: column;
    }

    wa-card {
      padding: 0;
      --spacing: var(--wa-space-s);
    }
    wa-card h3 {
      margin: 0;
    }

    .wa-gap-xs {
      gap: var(--wa-space-xs);
    }
    .wa-gap-s {
      gap: var(--wa-space-s);
    }
    .wa-heading-l {
      font-size: var(--wa-font-size-l);
    }
    [class*="wa-heading"] {
      font-family: var(--wa-font-family-heading);
      font-weight: var(--wa-font-weight-heading);
      line-height: var(--wa-line-height-condensed);
      text-wrap: balance;
    }
  `;

  _onClearClick() {
    this.dispatchEvent(new Event("clear"));
  }

  render() {
    return html`
      <wa-card>
        <h3 slot="header" class="wa-heading-l">${this.label}</h3>

        <div class="wa-stack wa-gap-s">
          <slot></slot>
        </div>

        <wa-button
          appearance="plain"
          slot="header-actions"
          size="m"
          @click=${this._onClearClick}
        >
          <wa-icon name="rotate-left" variant="solid" label="clear"></wa-icon>
        </wa-button>
      </wa-card>
    `;
  }
}

customElements.define("bw-settings-card", SettingsCard);
