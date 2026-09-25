import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

const { lit, BW, litRef, litSignals } = await waitForGlobals();

const { ref, createRef } = litRef;
const { SignalWatcher } = litSignals;

const { LitElement, html, css } = lit;

import "https://ka-f.webawesome.com/webawesome@3.12.0/components/button/button.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/spinner/spinner.js";
import "https://ka-f.webawesome.com/webawesome@3.12.0/components/animation/animation.js";

import { createDisableTransitionsContextConsumer } from "../../../../contexts/disableTransitionsContext.js";
import { createIsLeftHandedContextConsumer } from "../../../../contexts/isLeftHandedContext.js";
import { waitForAnimationFrames } from "../../../../../utils/rendering.js";
import { createDirectionContextConsumer } from "../../../../contexts/directionContext.js";
import {
  isScanningAvailableSignal,
  isScanningSignal,
  scannerSignal,
} from "./ScannerSignals.js";

class ToggleScannerButton extends SignalWatcher(LitElement) {
  createRenderRoot() {
    return this;
  }

  static properties = {
    isLeftHanded: { type: Boolean },
    useHandedness: { type: Boolean, attribute: "use-handedness" },
  };

  animationRef = createRef();

  _disableTransitionsConsumer = createDisableTransitionsContextConsumer(this);
  /** @type {import("../../../../contexts/disableTransitionsContext.js").DisableTransitionsContextState} */
  get _disableTransitionsState() {
    return this._disableTransitionsConsumer.value.state;
  }
  get disableTransitions() {
    return this._disableTransitionsState.disableTransitions;
  }

  _isLeftHandedConsumer = createIsLeftHandedContextConsumer(
    this,
    true,
    async () => {
      await waitForAnimationFrames(2);
      this.isLeftHanded = this.isLeftHandedState.isLeftHanded;
    },
  );
  /** @type {import("../../../../contexts/isLeftHandedContext.js").IsLeftHandedContextState} */
  get isLeftHandedState() {
    return this._isLeftHandedConsumer.value.state;
  }

  async _onClick() {
    const scanner = scannerSignal.get();
    scanner?.toggleScanner();
  }

  _directionConsumer = createDirectionContextConsumer(this, true);
  /** @type {import("../../../../contexts/directionContext.js").DirectionContextState} */
  get directionState() {
    return this._directionConsumer.value.state;
  }

  render() {
    const isScanningAvailable = isScanningAvailableSignal.get();
    const isScanning = isScanningSignal.get();

    let slotName = "start";
    if (this.useHandedness) {
      if (this.directionState.isLeftToRight) {
        slotName = this.isLeftHanded ? "start" : "end";
      } else {
        slotName = !this.isLeftHanded ? "start" : "end";
      }
    }
    const slot = isScanning
      ? html`<wa-spinner slot=${slotName}></wa-spinner>`
      : html`<wa-icon slot=${slotName} name="plus"></wa-icon>`;
    return html`
      <wa-animation
        name="pulse"
        easing="ease-in-out"
        duration="2000"
        ${ref(this.animationRef)}
      >
        <wa-button
          variant="brand"
          size="s"
          @click=${this._onClick}
          ?disabled=${!isScanningAvailable}
        >
          ${slot} ${isScanning ? "Scanning" : "Start Scan"}
        </wa-button>
      </wa-animation>
    `;
  }
}

customElements.define("bw-toggle-scanner-button", ToggleScannerButton);
