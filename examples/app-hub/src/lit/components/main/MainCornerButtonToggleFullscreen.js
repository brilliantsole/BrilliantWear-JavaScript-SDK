import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";
import { createFullscreenContextConsumer } from "../../contexts/fullscreenContext.js";

const { lit } = await waitForGlobals();

const { LitElement, html } = lit;

import "./MainCornerButton.js";

class MainCornerButtonToggleFullscreen extends LitElement {
  static properties = {
    isFullscreen: { type: Boolean },
  };

  constructor() {
    super();

    this.isFullscreen = false;

    this._fullscreenConsumer = createFullscreenContextConsumer(
      this,
      true,
      () => {
        this.isFullscreen = Boolean(document.fullscreenElement);
      },
    );
  }

  toggleFullScreen() {
    if (this.isFullscreen) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  }

  onClick(event) {
    this.toggleFullScreen();
  }

  render() {
    return html`<bw-main-corner-button
      icon-name=${this.isFullscreen
        ? "down-left-and-up-right-to-center"
        : "up-right-and-down-left-from-center"}
      label="toggle fullscreen"
      @click="${this.onClick}"
    >
    </bw-main-corner-button>`;
  }
}
customElements.define(
  "bw-main-corner-button-toggle-fullscreen",
  MainCornerButtonToggleFullscreen,
);
