import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/switch/switch.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/checkbox/checkbox.js";

class Toggle extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
    label: {},
    checked: { type: Boolean },
    indeterminate: { type: Boolean },
  };

  ref = createRef();

  get checked() {
    return this._checked;
  }
  set checked(value) {
    value = Boolean(value);

    const oldValue = this._checked;
    if (oldValue === value) return;

    this._checked = value;
    if (this.ref.value) {
      this.ref.value.checked = value;
    }
    this.requestUpdate("checked", oldValue);
  }

  render() {
    if (this.switch) {
      return html`<wa-switch ${ref(this.ref)} ?checked=${this.checked}
        >${this.label}</wa-switch
      >`;
    } else {
      return html`<wa-checkbox
        ?indeterminate=${this.indeterminate}
        ${ref(this.ref)}
        ?checked=${this.checked}
        >${this.label}</wa-checkbox
      >`;
    }
  }
}

customElements.define("bw-toggle", Toggle);
