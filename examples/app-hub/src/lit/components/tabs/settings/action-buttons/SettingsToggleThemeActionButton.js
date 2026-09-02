import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import { createToggleThemeActionButtonContextConsumer } from "../../../../contexts/toggleThemeActionButtonContext.js";

class SettingsToggleThemeActionButton extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  toggleThemeActionButtonConsumer =
    createToggleThemeActionButtonContextConsumer(this, true, () => {
      if (this.ref.value) {
        this.ref.value.checked = this.checked;
      }
    });

  /** @type {import("../../../../contexts/toggleThemeActionButtonContext.js").ToggleThemeActionButtonContextState} */
  get toggleThemeActionButtonState() {
    return this.toggleThemeActionButtonConsumer.value.state;
  }
  get isToggleThemeActionButtonVisible() {
    return this.toggleThemeActionButtonState.visible;
  }

  get checked() {
    return this.isToggleThemeActionButtonVisible;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.toggleThemeActionButtonState.visible = checked;

    this.toggleThemeActionButtonConsumer.value.update(
      this.toggleThemeActionButtonState,
      true,
    );
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Theme"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-toggle-theme-action-button-toggle",
  SettingsToggleThemeActionButton,
);
