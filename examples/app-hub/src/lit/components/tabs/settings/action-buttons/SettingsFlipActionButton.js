import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import { createFlipActionButtonContextConsumer } from "../../../../contexts/flipActionButtonContext.js";

class SettingsFlipActionButtonToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  flipActionButtonConsumer = createFlipActionButtonContextConsumer(
    this,
    true,
    () => {
      if (this.ref.value) {
        this.ref.value.checked = this.checked;
      }
    },
  );

  /** @type {import("../../../../contexts/flipActionButtonContext.js").FlipActionButtonContextState} */
  get flipActionButtonState() {
    return this.flipActionButtonConsumer.value.state;
  }
  get isFlipActionButtonVisible() {
    return this.flipActionButtonState.visible;
  }

  get checked() {
    return this.isFlipActionButtonVisible;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.flipActionButtonState.visible = checked;

    this.flipActionButtonConsumer.value.update(
      this.flipActionButtonState,
      true,
    );
  }

  render() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Flip"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define(
  "bw-settings-flip-action-button-toggle",
  SettingsFlipActionButtonToggle,
);
