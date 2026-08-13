import { waitForGlobals } from "../../utils/cross-origin-storage-utils.js";

const { lit, litRouter, litContext } = await waitForGlobals();

const { LitElement, html } = lit;
const { Routes } = litRouter;
const { ContextProvider } = litContext;

import { Router } from "../router/Router.js";

import "./layers/Layers.js";
import "./apps/Apps.js";
import "./devices/Devices.js";
import "./settings/Settings.js";

export const defaultTab = "layers";
export const defaultPath = `/${defaultTab}`;

import { createActiveTabContextProvider } from "../contexts/activeTabContext.js";
import { createScreenOrientationContextProvider } from "../contexts/screenOrientationContext.js";

export const tabs = ["layers", "apps", "devices", "settings"];
const tabRenders = {
  layers: () => html`<bw-layers></bw-layers>`,
  apps: () => html`<bw-apps></bw-apps>`,
  devices: () => html`<bw-devices></bw-devices>`,
  settings: () => html`<bw-settings></bw-settings>`,
};

import "./nav/NavButtonLayers.js";
import "./nav/NavButtonApps.js";
import "./nav/NavButtonDevices.js";
import "./nav/NavButtonSettings.js";
import "./nav/NavButtonFlip.js";

import { createIsLeftHandedContextProvider } from "../contexts/isLeftHandedContext.js";
import { createBatteryManagerContextProvider } from "../contexts/batteryManagerContext.js";
import { createDisableViewTransitionsContextProvider } from "../contexts/disableViewTransitionsContext.js";
import { createAnchorNavContextProvider } from "../contexts/anchorNavContext.js";
import { createReducedMotionContextProvider } from "../contexts/reducedMotionContext.js";
import { createTouchEnabledContextProvider } from "../contexts/touchEnabledContext.js";
import { createViewportOrientationContextProvider } from "../contexts/viewportOrientationContext.js";

class AppHub extends LitElement {
  createRenderRoot() {
    return this;
  }

  get anchorNav() {
    return this._anchorNav;
  }
  set anchorNav(newAnchorNav) {
    this._anchorNavContextProvider.value.update({
      anchorNav: newAnchorNav,
    });
  }
  _onAnchorNavUpdate() {
    const { anchorNav } = this._anchorNavContextProvider.value.state;
    console.log({ anchorNav });
    this._anchorNav = anchorNav;
    document.documentElement.toggleAttribute(
      "data-anchor-nav",
      this._anchorNav,
    );
  }

  get disableViewTransitions() {
    return this._disableViewTransitions;
  }
  set disableViewTransitions(newDisableViewTransitions) {
    this._disableViewTransitionsProvider.value.update({
      disableViewTransitions: newDisableViewTransitions,
    });
  }
  _onDisableViewTransitionsUpdate() {
    const { disableViewTransitions } =
      this._disableViewTransitionsProvider.value.state;
    console.log({ disableViewTransitions });
    this._disableViewTransitions = disableViewTransitions;
    document.documentElement.toggleAttribute(
      "data-disable-view-transitions",
      this._disableViewTransitions,
    );
  }
  get skipViewTransitions() {
    if (!document.startViewTransition) {
      return true;
    }
    if (this._reducedMotionEnabled) {
      return true;
    }
    if (this.disableViewTransitions) {
      return true;
    }
    // TODO: - return true if low power mode
  }

  constructor() {
    super();
    this.classList.add("mainAxis");

    this._themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!this._themeColorMeta) {
      this._themeColorMeta = document.createElement("meta");
      this._themeColorMeta.name = "theme-color";
      document.head.appendChild(this._themeColorMeta);
    }

    this._disableViewTransitionsProvider =
      createDisableViewTransitionsContextProvider(this, null, () =>
        this._onDisableViewTransitionsUpdate(),
      );
    this._anchorNavContextProvider = createAnchorNavContextProvider(
      this,
      null,
      () => this._onAnchorNavUpdate(),
    );
    this._activeTabProvider = createActiveTabContextProvider(this);
    this._screenOrientationProvider = createScreenOrientationContextProvider(
      this,
      null,
      () => this._onScreenOrientationUpdate(),
    );
    this._isLeftHandedProvider = createIsLeftHandedContextProvider(
      this,
      null,
      () => {
        this._onIsLeftHandedUpdate();
      },
    );
    this._reducedMotionProvider = createReducedMotionContextProvider(
      this,
      null,
      () => {
        this._onReducedMotionUpdate();
      },
    );
    this._touchEnabledProvider = createTouchEnabledContextProvider(
      this,
      null,
      () => {
        this._onTouchEnabledUpdate();
      },
    );
    this._viewportOrientationProvider =
      createViewportOrientationContextProvider(this, null, () => {
        this._onViewportOrientationUpdate();
      });
    this._batteryManagerProvider = createBatteryManagerContextProvider(
      this,
      null,
      () => {
        // console.log("batteryManagerState", this._batteryManagerState);
        this._batteryManagerState.changes.forEach((change) => {
          switch (change) {
            case "charging":
              this._onBatteryChargingChange();
              break;
            case "level":
              this._onBatteryLevelChange();
              break;
            case "chargingTime":
              this._onBatteryChargingTimeChange();
              break;
            case "dischargingTime":
              this._onBatteryDischargingTimeChange();
              break;
          }
        });
      },
    );

    this.router = new Router(
      this,
      tabs.map((tab) => ({
        path: `/${tab}`,
        render: tabRenders[tab],
      })),
      {
        defaultPath,
        beforeGoto: (pathname, activeTab) => {
          this._activeTabProvider.value.update({ activeTab });
        },
        afterGoto: (pathname, activeTab) => {
          console.log("after", pathname, { activeTab });
          this.activeTab = activeTab;
        },
      },
    );
    console.log("AppHub", this);
  }

  _updateMetaColor() {
    // console.log("_updateMetaColor");
    const metaContentColor = getComputedStyle(document.documentElement)
      .getPropertyValue("background-color")
      .trim();
    // console.log({ metaContentColor });
    this._themeColorMeta.setAttribute("content", metaContentColor);
  }

  connectedCallback() {
    super.connectedCallback();

    this._abortController = new AbortController();
    /** @type {AddEventListenerOptions} */
    const options = { signal: this._abortController.signal };

    this.addEventListener("touchend", this._onTouchEnd, options);

    this._onScreenOrientationUpdate();
    this._updateActiveTab();
    this._onIsLeftHandedUpdate();
    this._onReducedMotionUpdate();
    this._onTouchEnabledUpdate();
    this._onViewportOrientationUpdate();

    if (this._batteryManagerState.isAvailable) {
      this._onBatteryChargingChange();
      this._onBatteryLevelChange();
      this._onBatteryChargingTimeChange();
      this._onBatteryDischargingTimeChange();
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._abortController.abort();
  }

  #activeTab;
  get activeTab() {
    return this.#activeTab;
  }
  set activeTab(newActiveTab) {
    if (this.#activeTab == newActiveTab) {
      return;
    }
    this.#activeTab = newActiveTab;
    console.log({ activeTab: this.#activeTab });
    document.documentElement.dataset.activeTab = this.activeTab;
    this._updateMetaColor();
  }

  _onScreenOrientationUpdate() {
    // console.log("_onScreenOrientationUpdate");
    const { type } = this._screenOrientationProvider.value.state;
    this._screenOrientationType = type;
    document.documentElement.setAttribute(
      "data-screen-orientation-type",
      this._screenOrientationType,
    );
  }

  _onReducedMotionUpdate() {
    const { reducedMotion } = this._reducedMotionProvider.value.state;
    console.log({ reducedMotion });
    this._reducedMotion = reducedMotion;
  }
  _onTouchEnabledUpdate() {
    const { touchEnabled } = this._touchEnabledProvider.value.state;
    console.log({ touchEnabled });
    this._touchEnabled = touchEnabled;
  }
  /** @type {import("../contexts/viewportOrientationContext.js").ViewportOrientation} */
  _viewportOrientation = "landscape";
  _onViewportOrientationUpdate() {
    const { viewportOrientation } =
      this._viewportOrientationProvider.value.state;
    console.log({ viewportOrientation });
    this._viewportOrientation = viewportOrientation;
  }

  get isLeftHanded() {
    return this._isLeftHanded;
  }
  set isLeftHanded(newIsLeftHanded) {
    this._isLeftHandedProvider.value.update({
      isLeftHanded: newIsLeftHanded,
    });
  }
  _onIsLeftHandedUpdate() {
    const { isLeftHanded } = this._isLeftHandedProvider.value.state;
    console.log({ isLeftHanded });
    const update = () => {
      this._isLeftHanded = isLeftHanded;
      document.documentElement.toggleAttribute(
        "data-left-handed",
        this._isLeftHanded,
      );
    };

    if (
      !this._didFirstUpdate ||
      this.skipViewTransitions ||
      this.anchorNav ||
      !this._touchEnabled
    ) {
      update();
    } else {
      document.startViewTransition(() => {
        update();
      });
    }
  }

  firstUpdated() {
    console.log("firstUpdated");
    this._didFirstUpdate = true;
  }

  _updateActiveTab() {
    console.log("_updateActiveTab");
    const { activeTab } = this._activeTabProvider.value.state;
    console.log({ activeTab });
  }

  /** @type {import("../contexts/batteryManagerContext.js").BatteryManagerContextState} */
  get _batteryManagerState() {
    return this._batteryManagerProvider.value.state;
  }
  _onBatteryChargingChange = () => {
    // console.log("_onBatteryChargingChange");
    const { charging } = this._batteryManagerState;
    // console.log({ charging });
    // TODO: - flip if horizontal, header is on the "bottom", and !anchorNav
  };
  _onBatteryLevelChange = () => {
    // console.log("_onBatteryLevelChange");
    const { level } = this._batteryManagerState;
    // console.log({ level });
  };
  _onBatteryChargingTimeChange = () => {
    // console.log("_onBatteryChargingTimeChange");
    const { chargingTime } = this._batteryManagerState;
    // console.log({ chargingTime });
  };
  _onBatteryDischargingTimeChange = () => {
    // console.log("_onBatteryDischargingTimeChange");
    const { dischargingTime } = this._batteryManagerState;
    // console.log({ dischargingTime });
  };

  _lastTouchTime = 0;
  _doubleTapTime = 300;
  /** @param {TouchEvent} event */
  _onTouchEnd = (event) => {
    console.log("onTouchEnd", event);

    if (event.changedTouches.length != 1) {
      return;
    }
    if (event.touches.length != 0) {
      return;
    }

    const currentTime = new Date().getTime();
    const tapLength = currentTime - this._lastTouchTime;

    // console.log({ tapLength });

    if (tapLength < this._doubleTapTime && tapLength > 0) {
      console.log("double tap detected");
      event.preventDefault();
    }
    this._lastTouchTime = currentTime;
  };

  render() {
    return html`
      <header id="header" class="crossAxis">
        <nav id="nav" class="crossAxis">
          <bw-nav-button-layers></bw-nav-button-layers>
          <bw-nav-button-apps></bw-nav-button-apps>
          <bw-nav-button-devices></bw-nav-button-devices>
          <bw-nav-button-settings></bw-nav-button-settings>
        </nav>
        <menu id="menu">
          <bw-nav-button-flip></bw-nav-button-flip>
        </menu>
      </header>
      <main id="main">${this.router.outlet()}</main>
    `;
  }
}
customElements.define("bw-app-hub", AppHub);
