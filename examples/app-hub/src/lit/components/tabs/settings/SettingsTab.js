import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/divider/divider.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/breadcrumb/breadcrumb.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/breadcrumb-item/breadcrumb-item.js";

import "../TabBreadcrumb.js";
import "./SettingsAppearance.js";

class SettingsTab extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="wa-stack wa-gap-xs">
        <bw-tab-breadcrumb icon-name="gear"> </bw-tab-breadcrumb>

        <div>
          <bw-settings-appearance></bw-settings-appearance>
        </div>
      </div>
    `;
  }
}

customElements.define("bw-settings-tab", SettingsTab);
