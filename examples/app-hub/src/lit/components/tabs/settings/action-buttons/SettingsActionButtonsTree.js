import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, litRef } = await waitForGlobals();

const { LitElement, html } = lit;
const { ref, createRef } = litRef;

import "../../../utils/Toggle.js";

import "./SettingsFlipActionButton.js";
import "./SettingsToggleThemeActionButton.js";
import "./SettingsToggleFullscreenActionButton.js";
import "./SettingsToggleHeaderHiddenActionButton.js";

import { createFlipActionButtonContextConsumer } from "../../../../contexts/flipActionButtonContext.js";
import { createToggleHeaderHiddenActionButtonContextConsumer } from "../../../../contexts/toggleHeaderHiddenActionButtonContext.js";
import { createToggleFullscreenActionButtonContextConsumer } from "../../../../contexts/toggleFullscreenActionButtonContext.js";
import { createToggleThemeActionButtonContextConsumer } from "../../../../contexts/toggleThemeActionButtonContext.js";

class SettingsActionButtonsTreeElement extends LitElement {
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
      this._updateChecked();
    },
  );
  /** @type {import("../../../../contexts/flipActionButtonContext.js").FlipActionButtonContextState} */
  get flipActionButtonState() {
    return this.flipActionButtonConsumer.value.state;
  }
  get isFlipActionButtonVisible() {
    return this.flipActionButtonState.visible;
  }

  toggleFullscreenActionButtonConsumer =
    createToggleFullscreenActionButtonContextConsumer(this, true, () => {
      this._updateChecked();
    });
  /** @type {import("../../../../contexts/toggleFullscreenActionButtonContext.js").ToggleFullscreenActionButtonContextState} */
  get toggleFullscreenActionButtonState() {
    return this.toggleFullscreenActionButtonConsumer.value.state;
  }
  get isToggleFullscreenActionButtonVisible() {
    return this.toggleFullscreenActionButtonState.visible;
  }

  toggleThemeActionButtonConsumer =
    createToggleThemeActionButtonContextConsumer(this, true, () => {
      this._updateChecked();
    });
  /** @type {import("../../../../contexts/toggleThemeActionButtonContext.js").ToggleThemeActionButtonContextState} */
  get toggleThemeActionButtonState() {
    return this.toggleThemeActionButtonConsumer.value.state;
  }
  get isToggleThemeActionButtonVisible() {
    return this.toggleThemeActionButtonState.visible;
  }

  toggleHeaderHiddenActionButtonConsumer =
    createToggleHeaderHiddenActionButtonContextConsumer(this, true, () => {
      this._updateChecked();
    });
  /** @type {import("../../../../contexts/toggleHeaderHiddenActionButtonContext.js").ToggleHeaderHiddenActionButtonContextState} */
  get toggleHeaderHiddenActionButtonState() {
    return this.toggleHeaderHiddenActionButtonConsumer.value.state;
  }
  get isToggleHeaderHiddenActionButtonVisible() {
    return this.toggleHeaderHiddenActionButtonState.visible;
  }

  _onChange(event) {
    const { checked } = event.target;
    const areActionButtonsVisible = checked;

    this.flipActionButtonState.visible = areActionButtonsVisible;
    this.flipActionButtonConsumer.value.update(
      this.flipActionButtonState,
      true,
    );

    this.toggleFullscreenActionButtonState.visible = areActionButtonsVisible;
    this.toggleFullscreenActionButtonConsumer.value.update(
      this.toggleFullscreenActionButtonState,
      true,
    );

    this.toggleThemeActionButtonState.visible = areActionButtonsVisible;
    this.toggleThemeActionButtonConsumer.value.update(
      this.toggleThemeActionButtonState,
      true,
    );

    this.toggleHeaderHiddenActionButtonState.visible = areActionButtonsVisible;
    this.toggleHeaderHiddenActionButtonConsumer.value.update(
      this.toggleHeaderHiddenActionButtonState,
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

  get booleans() {
    return [
      this.isFlipActionButtonVisible,
      this.isToggleFullscreenActionButtonVisible,
      this.isToggleThemeActionButtonVisible,
      this.isToggleHeaderHiddenActionButtonVisible,
    ];
  }
  get checked() {
    return this.booleans.every(Boolean);
  }
  get indeterminate() {
    return !this.booleans.every(Boolean) && this.booleans.some(Boolean);
  }

  firstUpdated() {
    this._didFirstUpdate = true;
    this._updateChecked();
  }

  _label = "All Buttons";

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
          <div class="wa-stack wa-gap-xs">
            <bw-settings-flip-action-button-toggle></bw-settings-flip-action-button-toggle>
            <bw-settings-toggle-header-hidden-action-button-toggle></bw-settings-toggle-header-hidden-action-button-toggle>
            <bw-settings-toggle-fullscreen-action-button-toggle></bw-settings-toggle-fullscreen-action-button-toggle>
            <bw-settings-toggle-theme-action-button-toggle></bw-settings-toggle-theme-action-button-toggle>
          </div>
        </div>
      `;
    }
  }
}

customElements.define(
  "bw-settings-action-buttons-tree",
  SettingsActionButtonsTreeElement,
);
