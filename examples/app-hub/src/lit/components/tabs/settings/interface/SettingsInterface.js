import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";
import {
  createFullscreenContextConsumer,
  exitFullscreen,
} from "../../../../contexts/fullscreenContext.js";
import { createIsLeftHandedContextConsumer } from "../../../../contexts/isLeftHandedContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "../SettingsCard.js";

import "./SettingsFullscreenToggle.js";
import "./SettingsLeftHandedToggle.js";

class SettingsInterface extends LitElement {
  _fullscreenConsumer = createFullscreenContextConsumer(this);
  _isLeftHandedConsumer = createIsLeftHandedContextConsumer(this);

  clear() {
    console.log("clear interface settings");
    exitFullscreen();
    this._isLeftHandedConsumer.value.clear();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bw-settings-card label="Interface" @clear=${this.clear}>
        <bw-settings-fullscreen-toggle switch></bw-settings-fullscreen-toggle>
        <bw-settings-left-handed-toggle switch></bw-settings-left-handed-toggle>
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-interface", SettingsInterface);
