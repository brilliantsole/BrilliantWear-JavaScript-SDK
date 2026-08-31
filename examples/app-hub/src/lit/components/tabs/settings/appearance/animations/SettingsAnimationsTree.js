import { waitForGlobals } from "../../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/checkbox/checkbox.js";

import { createDisableTransitionsContextConsumer } from "../../../../../contexts/disableTransitionsContext.js";
import { createDisableViewTransitionsContextConsumer } from "../../../../../contexts/disableViewTransitionsContext.js";

import "../../../../utils/Toggle.js";

import "./SettingsTransitionsToggle.js";
import "./SettingsViewTransitionsToggle.js";

class SettingsAnimationsTreeElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  static properties = {
    switch: { type: Boolean },
  };

  ref = createRef();

  _transitionsConsumer = createDisableTransitionsContextConsumer(
    this,
    true,
    () => {
      this._updateChecked();
    },
  );
  _viewTransitionsConsumer = createDisableViewTransitionsContextConsumer(
    this,
    true,
    () => {
      this._updateChecked();
    },
  );

  /** @type {import("../../../../../contexts/disableTransitionsContext.js").DisableTransitionsContextState} */
  get disableTransitionsContextState() {
    return this._transitionsConsumer.value.state;
  }
  get isTransitionsDisabled() {
    return this.disableTransitionsContextState.disableTransitions;
  }

  /** @type {import("../../../../../contexts/disableViewTransitionsContext.js").DisableViewTransitionsContextState} */
  get disableViewTransitionsContextState() {
    return this._viewTransitionsConsumer.value.state;
  }
  get isViewTransitionsDisabled() {
    return this.disableViewTransitionsContextState.disableViewTransitions;
  }

  _onChange(event) {
    const { checked } = event.target;
    const isAnimationsEnabled = checked;

    this.disableTransitionsContextState.disableTransitions =
      !isAnimationsEnabled;
    this._transitionsConsumer.value.update(
      this.disableTransitionsContextState,
      true,
    );

    this.disableViewTransitionsContextState.disableViewTransitions =
      !isAnimationsEnabled;
    this._viewTransitionsConsumer.value.update(
      this.disableViewTransitionsContextState,
      true,
    );
  }

  _updateChecked() {
    if (!this._didFirstUpdate) {
      return;
    }

    if (this.ref.value) {
      if (!this.switch) {
        this.ref.value.indeterminate = this.indeterminate;
      }
      this.ref.value.checked = this.checked;
    }
  }

  get checked() {
    return !this.isViewTransitionsDisabled && !this.isTransitionsDisabled;
  }
  get indeterminate() {
    return this.isViewTransitionsDisabled != this.isTransitionsDisabled;
  }

  firstUpdated() {
    this._didFirstUpdate = true;
    this._updateChecked();
  }

  _label = "Animations";

  renderToggle() {
    return html`<bw-toggle
      ${ref(this.ref)}
      ?checked=${this.checked}
      @change=${this._onChange}
      label="${this._label}"
      ?switch=${this.switch}
      ?indeterminate=${this.indeterminate}
    ></bw-toggle>`;
  }

  render() {
    const toggle = this.renderToggle();
    if (this.switch) {
      return toggle;
    } else {
      return html`
        <div class="wa-stack wa-gap-xs">
          ${toggle}
          <div
            class="wa-stack wa-gap-xs"
            style="padding-inline-start: var(--wa-space-l);"
          >
            <bw-settings-view-transitions-toggle></bw-settings-view-transitions-toggle>
            <bw-settings-transitions-toggle></bw-settings-transitions-toggle>
          </div>
        </div>
      `;
    }
  }
}

customElements.define(
  "bw-settings-animations-tree",
  SettingsAnimationsTreeElement,
);
