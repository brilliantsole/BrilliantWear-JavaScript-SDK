import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";
import { createIsLeftHandedContextConsumer } from "../../../../contexts/isLeftHandedContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "../SettingsCard.js";

import "./SettingsLeftHandedToggle.js";
import "./SettingsHideHeaderToggle.js";
import "./SettingsAnchorHeaderToggle.js";

class SettingsInterface extends LitElement {
  _isLeftHandedConsumer = createIsLeftHandedContextConsumer(this);

  clear() {
    console.log("clear interface settings");
    this._isLeftHandedConsumer.value.clear();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bw-settings-card label="Interface" @clear=${this.clear}>
        <bw-settings-left-handed-toggle switch></bw-settings-left-handed-toggle>
        <bw-settings-hide-header-toggle switch></bw-settings-hide-header-toggle>
        <bw-settings-anchor-header-toggle
          switch
        ></bw-settings-anchor-header-toggle>
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-interface", SettingsInterface);
