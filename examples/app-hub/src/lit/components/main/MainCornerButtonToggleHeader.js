import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
import { createIsHeaderHiddenContextConsumer } from "../../contexts/isHeaderHiddenContext.js";
import { createHeaderSideContextConsumer } from "../../contexts/headerSideContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./MainCornerButton.js";

/** @typedef {"left" | "right" | "top" | "bottom"} ChevronDirection */
/** @typedef {import("../../contexts/headerSideContext.js").HeaderSide} HeaderSide */

/** @type {Record<HeaderSide, ChevronDirection>} */
const chevronDirections = {
  top: "up",
  bottom: "down",
  left: "left",
  right: "right",
};
/** @type {Record<HeaderSide, ChevronDirection>} */
const oppositeChevronDirections = {
  bottom: "up",
  top: "down",
  left: "right",
  right: "left",
};

class MainCornerButtonToggleHeader extends LitElement {
  constructor() {
    super();
    this._isHeaderHiddenConsumer = createIsHeaderHiddenContextConsumer(
      this,
      true,
    );
    this._headerSideConsumer = createHeaderSideContextConsumer(this, true);
  }

  get isHeaderHidden() {
    return this._isHeaderHiddenConsumer.value.state.isHeaderHidden;
  }
  /** @type {HeaderSide} */
  get headerSide() {
    return this._headerSideConsumer.value.state.headerSide;
  }

  toggleHeader() {
    const isHeaderHidden = !this.isHeaderHidden;
    this._isHeaderHiddenConsumer.value.update({ isHeaderHidden });
  }

  onClick(event) {
    this.toggleHeader();
  }

  render() {
    const iconName = `chevron-${this.isHeaderHidden ? oppositeChevronDirections[this.headerSide] : chevronDirections[this.headerSide]}`;

    return html`<bw-main-corner-button
      icon-name=${iconName}
      label=${this.isHeaderHidden ? "show header" : "hide header"}
      @click="${this.onClick}"
    >
    </bw-main-corner-button>`;
  }
}
customElements.define(
  "bw-main-corner-button-toggle-header",
  MainCornerButtonToggleHeader,
);
