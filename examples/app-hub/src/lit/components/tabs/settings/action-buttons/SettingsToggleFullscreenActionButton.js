import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import { createToggleFullscreenActionButtonContextConsumer } from "../../../../contexts/toggleFullscreenActionButtonContext.js";

class SettingsToggleFullscreenActionButton extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  toggleFullscreenActionButtonConsumer =
    createToggleFullscreenActionButtonContextConsumer(this, true, () => {
      if (this.ref.value) {
        this.ref.value.checked = this.checked;
      }
    });

  /** @type {import("../../../../contexts/toggleFullscreenActionButtonContext.js").ToggleFullscreenActionButtonContextState} */
  get toggleFullscreenActionButtonState() {
    return this.toggleFullscreenActionButtonConsumer.value.state;
  }
  get isToggleFullscreenActionButtonVisible() {
    return this.toggleFullscreenActionButtonState.visible;
  }

  get checked() {
    return this.isToggleFullscreenActionButtonVisible;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.toggleFullscreenActionButtonState.visible = checked;

    this.toggleFullscreenActionButtonConsumer.value.update(
      this.toggleFullscreenActionButtonState,
      true,
    );
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Fullscreen"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-toggle-fullscreen-action-button-toggle",
  SettingsToggleFullscreenActionButton,
);
