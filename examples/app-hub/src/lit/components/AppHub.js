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

import "./main/MainCornerButton.js";

import { createIsLeftHandedContextProvider } from "../contexts/isLeftHandedContext.js";
import { createBatteryManagerContextProvider } from "../contexts/batteryManagerContext.js";
import { createDisableViewTransitionsContextProvider } from "../contexts/disableViewTransitionsContext.js";
import { createAnchorNavContextProvider } from "../contexts/anchorNavContext.js";
import { createReducedMotionContextProvider } from "../contexts/reducedMotionContext.js";
import { createTouchEnabledContextProvider } from "../contexts/touchEnabledContext.js";
import { createViewportOrientationContextProvider } from "../contexts/viewportOrientationContext.js";
import { createVisibilityContextProvider } from "../contexts/visibilityContext.js";

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

  _hidden = false;
  _onVisibilityUpdate() {
    const { hidden } = this._visibilityProvider.value.state;
    // console.log({ hidden });
    this._hidden = hidden;
    if (!hidden) {
      this._resetViewport();
    }
  }
  _resetViewport() {
    // console.log("_resetViewport");
    window.scrollTo(0, 1);
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 1;
    document.body.scrollTop = 1;
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
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
    if (this._hidden) {
      return true;
    }
    // TODO: - return true if low power mode
    return false;
  }

  constructor() {
    super();
    this.dataset.axis = "main";

    this._themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (!this._themeColorMeta) {
      this._themeColorMeta = document.createElement("meta");
      this._themeColorMeta.name = "theme-color";
      document.head.appendChild(this._themeColorMeta);
    }

    this._visibilityProvider = createVisibilityContextProvider(this, null, () =>
      this._onVisibilityUpdate(),
    );
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
          this._lastTouchTime = 0;
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

    window.addEventListener("pageshow", this._resetViewport, options);

    // document.addEventListener("touchmove", this._onTouchMove, options);
    document.addEventListener("keydown", this._onKeyDown, options);

    this.addEventListener("touchend", this._onTouchEnd, {
      ...options,
      passive: false,
    });

    this._onScreenOrientationUpdate();
    this._updateActiveTab();
    this._onIsLeftHandedUpdate();
    this._onReducedMotionUpdate();
    this._onTouchEnabledUpdate();
    this._onViewportOrientationUpdate();
    this._onVisibilityUpdate();

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
    // console.log({ activeTab: this.#activeTab });
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
    // console.log({ reducedMotion });
    this._reducedMotion = reducedMotion;
  }
  _onTouchEnabledUpdate() {
    const { touchEnabled } = this._touchEnabledProvider.value.state;
    // console.log({ touchEnabled });
    this._touchEnabled = touchEnabled;
  }
  /** @type {import("../contexts/viewportOrientationContext.js").ViewportOrientation} */
  _viewportOrientation = "landscape";
  _onViewportOrientationUpdate() {
    const { viewportOrientation } =
      this._viewportOrientationProvider.value.state;
    // console.log({ viewportOrientation });
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
      document.documentElement.toggleAttribute(
        "data-left-handed",
        isLeftHanded,
      );
      this._isLeftHanded = isLeftHanded;
    };

    if (
      !this._didFirstUpdate ||
      this.skipViewTransitions ||
      this.anchorNav ||
      !this._touchEnabled
    ) {
      update();
    } else {
      const types = [isLeftHanded ? "left-handed" : "right-handed"];
      console.log("types", types);
      document.startViewTransition({
        update: async () => {
          update();
        },
        types,
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
  _doubleTapTimeThreshold = 500;
  _lastTouchPosition;
  _doubleTapDistanceSquaredThreshold = 200;
  /** @param {TouchEvent} event */
  _onTouchEnd = (event) => {
    // console.log("_onTouchEnd", event);
    const { changedTouches, touches } = event;

    if (changedTouches.length != 1) {
      return;
    }
    if (touches.length != 0) {
      return;
    }
    this._ignoreTouchIdentifier = false;
    const touch = changedTouches[0];
    // console.log("touch", touch);
    const { screenX, screenY } = touch;

    if (touch.identifier == this._latestTouchMove?.identifier) {
      this._ignoreTouchIdentifier = false;
      this._latestTouchMove = undefined;
    }

    const currentTime = new Date().getTime();
    const tapLength = currentTime - this._lastTouchTime;

    // console.log({ tapLength });

    if (
      tapLength < this._doubleTapTimeThreshold &&
      tapLength > 0 &&
      !event.target.nodeName.includes("BUTTON")
    ) {
      const screenDelta = {
        screenX: screenX - this._lastTouchPosition.screenX,
        screenY: screenY - this._lastTouchPosition.screenY,
      };
      const screenDistanceSquared =
        screenDelta.screenX ** 2 + screenDelta.screenY ** 2;
      // console.log({ screenDistanceSquared });
      if (screenDistanceSquared < this._doubleTapDistanceSquaredThreshold) {
        // console.log("double tap detected", event.target);
        event.preventDefault();
      }
    }
    this._lastTouchTime = currentTime;
    this._lastTouchPosition = { screenX, screenY };
  };

  /** @type {{identifier: number, screenX: number, screenY: number, timeStamp: number}?} */
  _latestTouchMove;
  _ignoreTouchIdentifier;
  _touchMoveMagnitudeThreshold = 50;
  _touchMoveAngleThreshold = 0.6;
  /** @param {TouchEvent} event */
  _onTouchMove = (event) => {
    // console.log("_onTouchMove", event);
    const { targetTouches } = event;
    if (targetTouches.length != 1) {
      return;
    }
    const touch = targetTouches[0];
    const { identifier, screenX, screenY } = touch;
    const { timeStamp } = event;
    if (this._ignoreTouchIdentifier) {
      // console.log("ignoring touch identifier");
      return;
    }
    if (identifier != this._latestTouchMove?.identifier) {
      this._latestTouchMove = {
        identifier,
        screenX,
        screenY,
        timeStamp,
      };
      return;
    }
    const touchMoveDelta = {
      screenX: screenX - this._latestTouchMove.screenX,
      screenY: screenY - this._latestTouchMove.screenY,
      timeStamp: timeStamp - this._latestTouchMove.timeStamp,
    };
    let angle = Math.atan2(touchMoveDelta.screenY, touchMoveDelta.screenX);
    const twoPI = 2 * Math.PI;
    while (angle < 0) {
      angle += twoPI;
    }
    angle %= twoPI;
    const magnitude = Math.sqrt(
      touchMoveDelta.screenX ** 2 + touchMoveDelta.screenY ** 2,
    );
    // console.log({ angle, magnitude });
    if (magnitude < this._touchMoveMagnitudeThreshold) {
      return;
    }

    let direction;
    for (let i = 0; i < 4; i++) {
      const _angle = (twoPI / 4) * i;
      const difference = Math.min(
        Math.abs(_angle - angle),
        Math.abs(_angle - (angle - twoPI)),
      );
      if (difference < this._touchMoveAngleThreshold) {
        direction = this._directions[i];
      }
    }
    // console.log({ direction, angle });

    if (!direction) {
      return;
    }

    this._ignoreTouchIdentifier = true;

    this._onGestureDirection(direction, true, true);
  };

  /** @param {KeyboardEvent} event */
  _onKeyDown = (event) => {
    /** @type {Direction} */
    let direction;
    let allowOverflow = true;
    const { key } = event;
    switch (key) {
      case "ArrowUp":
        direction = "up";
        break;
      case "ArrowRight":
        direction = "right";
        break;
      case "ArrowDown":
        direction = "down";
        break;
      case "ArrowLeft":
        direction = "left";
        break;
    }
    if (direction) {
      this._onGestureDirection(direction, false, allowOverflow);
    }
  };

  /** @typedef {"right" | "down" | "left" | "up"} Direction */
  /** @type {Direction[]} */
  _directions = ["right", "down", "left", "up"];
  /**
   * @param {Direction} direction
   * @param {boolean?} isTouch
   * @param {boolean?} allowOverflow
   */
  _onGestureDirection(direction, isTouch, allowOverflow) {
    console.log("_onGestureDirection", {
      direction,
      isTouch,
      _touchEnabled: this._touchEnabled,
    });

    const currentTabIndex = tabs.indexOf(this.activeTab);
    let newTabIndex = currentTabIndex;
    let tabIndexOffset = 0;
    // console.log({ key, currentTabIndex });
    switch (this._viewportOrientation) {
      case "landscape":
        {
          switch (direction) {
            case "up":
              tabIndexOffset = -1;
              break;
            case "down":
              tabIndexOffset = 1;
              break;
            case "left":
              // FILL - hide header
              break;
            case "right":
              // FILL - hide header
              break;
          }
          if (isTouch) {
            tabIndexOffset *= -1;
          }
        }
        break;
      case "portrait":
        {
          switch (direction) {
            case "right":
              tabIndexOffset = 1;
              break;
            case "left":
              tabIndexOffset = -1;
              break;
            case "down":
              // FILL - hide header
              break;
            case "up":
              // FILL - hide header
              break;
          }
          if (this._touchEnabled && this._isLeftHanded == isTouch) {
            tabIndexOffset *= -1;
            console.log("FLIP");
          }
        }
        break;
    }

    if (tabIndexOffset == 0) {
      return;
    }
    newTabIndex += tabIndexOffset;

    const outOfRange = newTabIndex < 0 || newTabIndex >= tabs.length;
    if (outOfRange && !allowOverflow) {
      return;
    }
    while (newTabIndex < 0) {
      newTabIndex += tabs.length;
    }
    newTabIndex %= tabs.length;

    // console.log({ newTabIndex });
    if (newTabIndex != currentTabIndex) {
      try {
        const type = tabIndexOffset > 0 ? "next-tab" : "previous-tab";
        const types = [type];
        // console.log({ tabIndexOffset, type, types });
        navigation.navigate(`/${tabs[newTabIndex]}`, { info: { types } });
      } catch (error) {
        // console.error(error);
      }
    }
  }

  render() {
    return html`
      <header id="header" data-axis="cross" @touchmove=${this._onTouchMove}>
        <nav id="nav" data-axis="cross">
          <bw-nav-button-layers></bw-nav-button-layers>
          <bw-nav-button-apps></bw-nav-button-apps>
          <bw-nav-button-devices></bw-nav-button-devices>
          <bw-nav-button-settings></bw-nav-button-settings>
        </nav>
        <menu id="menu" data-axis="cross">
          <bw-nav-button-flip data-touch-only></bw-nav-button-flip>
        </menu>
      </header>
      <div id="main">
        <main>${this.router.outlet()}</main>

        <div id="mainOverlay">
          <div data-mouse-only data-main-align="start" data-cross-align="start">
            <button>Start Start.</button>
          </div>
          <div
            data-mouse-only
            data-main-align="start"
            data-cross-align="center"
          >
            <button>Start Center.</button>
          </div>
          <div data-mouse-only data-main-align="start" data-cross-align="end">
            <button>Start End.</button>
          </div>
          <div
            data-mouse-only
            data-main-align="center"
            data-cross-align="start"
          >
            <button>Center Start.</button>
          </div>
          <div
            data-mouse-only
            data-main-align="center"
            data-cross-align="center"
          >
            <button>Center Center.</button>
          </div>
          <div data-mouse-only data-main-align="center" data-cross-align="end">
            <button>Center End.</button>
          </div>
          <div data-mouse-only data-main-align="end" data-cross-align="start">
            <button>End Start.</button>
          </div>
          <div data-mouse-only data-main-align="end" data-cross-align="center">
            <button>End Center.</button>
          </div>
          <div data-mouse-only data-main-align="end" data-cross-align="end">
            <button>End End.</button>
          </div>

          <div data-touch-only data-main-align="start" data-cross-align="start">
            <button>Start Start</button>
          </div>
          <div
            data-touch-only
            data-main-align="start"
            data-cross-align="center"
          >
            <button>Start Center</button>
          </div>
          <div data-touch-only data-main-align="start" data-cross-align="end">
            <button>Start End</button>
          </div>
          <div
            data-touch-only
            data-main-align="center"
            data-cross-align="start"
          >
            <button>Center Start</button>
          </div>
          <div
            data-touch-only
            data-main-align="center"
            data-cross-align="center"
          >
            <button>Center Center</button>
          </div>
          <div data-touch-only data-main-align="center" data-cross-align="end">
            <button>Center End</button>
          </div>
          <div data-touch-only data-main-align="end" data-cross-align="start">
            <button>End Start</button>
          </div>
          <div data-touch-only data-main-align="end" data-cross-align="center">
            <button>End Center</button>
          </div>
          <div data-touch-only data-main-align="end" data-cross-align="end">
            <button>End End</button>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define("bw-app-hub", AppHub);
