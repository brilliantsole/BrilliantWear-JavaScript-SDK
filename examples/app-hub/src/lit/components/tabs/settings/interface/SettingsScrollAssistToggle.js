import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import { createScrollAssistContextConsumer } from "../../../../contexts/scrollAssistContext.js";

class SettingsThemeToggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();
  _scrollAssistConsumer = createScrollAssistContextConsumer(this, true, () => {
    if (this.ref.value) {
      this.ref.value.checked = this.checked;
    }
  });

  /** @type {import("../../../../contexts/scrollAssistContext.js").ScrollAssistContextState} */
  get scrollAssistState() {
    return this._scrollAssistConsumer.value.state;
  }
  get scrollAssist() {
    return this.scrollAssistState.scrollAssist;
  }

  _onChange(event) {
    const { checked } = event.target;
    event.target.checked = this.checked;
    this.scrollAssistState.scrollAssist = checked;
    this._scrollAssistConsumer.value.update(this.scrollAssistState, true);
  }

  get checked() {
    return this.scrollAssist;
  }

  render() {
    return html`<bw-toggle
      data-touch-only
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="Scroll Assist"
      ?switch=${this.switch}
    ></bw-toggle>`;
  }
}

customElements.define("bw-settings-scroll-assist-toggle", SettingsThemeToggle);
