import { waitForGlobals } from "../../../../utils/cross-origin-storage-utils.js";
import { createTouchEnabledContextConsumer } from "../../../contexts/touchEnabledContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "./appearance/SettingsAppearance.js";
import "./interface/SettingsInterface.js";

class SettingsTab extends LitElement {
  createRenderRoot() {
    return this;
  }

  _touchEnabledConsumer = createTouchEnabledContextConsumer(this, true);
  get touchEnabled() {
    return this._touchEnabledConsumer.value.state.touchEnabled;
  }

  render() {
    const settingsInterface = this.touchEnabled
      ? html`<bw-settings-interface></bw-settings-interface>`
      : "";

    return html`
      <div class="bw-grid-lanes">
        <bw-settings-appearance></bw-settings-appearance>
        ${settingsInterface}
      </div>
    `;
  }
}

customElements.define("bw-settings-tab", SettingsTab);
