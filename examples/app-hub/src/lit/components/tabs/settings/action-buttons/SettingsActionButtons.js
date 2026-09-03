import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";
import { createFlipActionButtonContextConsumer } from "../../../../contexts/flipActionButtonContext.js";
import { createToggleFullscreenActionButtonContextConsumer } from "../../../../contexts/toggleFullscreenActionButtonContext.js";
import { createToggleHeaderHiddenActionButtonContextConsumer } from "../../../../contexts/toggleHeaderHiddenActionButtonContext.js";
import { createToggleThemeActionButtonContextConsumer } from "../../../../contexts/toggleThemeActionButtonContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "../SettingsCard.js";
import "./SettingsActionButtonsTree.js";

class SettingsActionButtons extends LitElement {
  flipActionButtonConsumer = createFlipActionButtonContextConsumer(this);
  toggleFullscreenActionButtonConsumer =
    createToggleFullscreenActionButtonContextConsumer(this);
  toggleThemeActionButtonConsumer =
    createToggleThemeActionButtonContextConsumer(this);
  toggleHeaderHiddenActionButtonConsumer =
    createToggleHeaderHiddenActionButtonContextConsumer(this);

  clear() {
    console.log("clear action buttons settings");

    this.flipActionButtonConsumer.value.clear();
    this.toggleFullscreenActionButtonConsumer.value.clear();
    this.toggleThemeActionButtonConsumer.value.clear();
    this.toggleHeaderHiddenActionButtonConsumer.value.clear();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bw-settings-card label="Action Buttons" @clear=${this.clear}>
        <bw-settings-action-buttons-tree></bw-settings-action-buttons-tree>
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-action-buttons", SettingsActionButtons);
