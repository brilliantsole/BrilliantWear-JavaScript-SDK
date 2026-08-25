import { waitForGlobals } from "../../../utils/cross-origin-storage-utils.js";

const { lit } = await waitForGlobals();

const { LitElement, html, css } = lit;

class AppsElement extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<h1>Apps</h1>`;
  }
}

customElements.define("bw-apps", AppsElement);
