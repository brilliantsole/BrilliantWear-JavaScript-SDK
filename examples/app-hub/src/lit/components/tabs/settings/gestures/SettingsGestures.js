import { waitForGlobals } from "../../../../../utils/cross-origin-storage-utils.js";

import { createSwipeToChangeTabGestureContextConsumer } from "../../../../contexts/swipeToChangeTabGestureContext.js";
import { createSwipeToHideHeaderGestureContextConsumer } from "../../../../contexts/swipeToHideHeaderGestureContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

import "../SettingsCard.js";

import "./SettingsGesturesTree.js";

class SettingsGestures extends LitElement {
  _swipeToChangeTabGestureConsumer =
    createSwipeToChangeTabGestureContextConsumer(this);
  _swipeToHideHeaderConsumer =
    createSwipeToHideHeaderGestureContextConsumer(this);

  clear() {
    console.log("clear gestures settings");
    this._swipeToChangeTabGestureConsumer.value.clear();
    this._swipeToHideHeaderConsumer.value.clear();
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <bw-settings-card label="Gestures" @clear=${this.clear}>
        <bw-settings-gestures-tree></bw-settings-gestures-tree>
      </bw-settings-card>
    `;
  }
}

customElements.define("bw-settings-gestures", SettingsGestures);
