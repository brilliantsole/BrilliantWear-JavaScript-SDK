import autoBind from "auto-bind";
import { createConsole } from "../utils/Console.ts";
import Device from "../Device.ts";
import EventDispatcher from "../utils/EventDispatcher.ts";
import { Size2, Vector2 } from "../utils/MathUtils.ts";

export const TrackpadSensorTypes = [
  "trackpadBitmaps",
  "trackpadTouches",
  "trackpadTouchMovements",
  "trackpadTouchPositions",
  "trackpadGestures",
  "trackpadTouchStrengths",
  "trackpadTouchAreas",
] as const;
export type TrackpadSensorType = (typeof TrackpadSensorTypes)[number];

export const TrackpadTapGestures = ["tap"] as const;
export type TrackpadTapGesture = (typeof TrackpadTapGestures)[number];

export const TrackpadSwipeGestures = [
  "swipeLeft",
  "swipeRight",
  "swipeUp",
  "swipeDown",
] as const;
export type TrackpadSwipeGesture = (typeof TrackpadSwipeGestures)[number];

export const TrackpadGestures = [
  ...TrackpadTapGestures,
  ...TrackpadSwipeGestures,
] as const;
export type TrackpadGesture = (typeof TrackpadGestures)[number];

export const TrackpadInformationTypes = ["actualSize", "bitmapSize"] as const;
export type TrackpadInformationType = (typeof TrackpadInformationTypes)[number];

export const TrackpadMessageTypes = ["trackpadsInformation"] as const;
export type TrackpadMessageType = (typeof TrackpadMessageTypes)[number];

export const RequiredTrackpadMessageTypes: TrackpadMessageType[] = [
  "trackpadsInformation",
] as const;

export interface TrackpadInformation {
  index: number;
  /** trackpad size in millimeters */
  actualSize: Size2;
  bitmapSize?: Size2;
}
export type TrackpadsInformation = TrackpadInformation[];

export interface TrackpadTouch {
  trackpadIndex: number;
  touchIndex: number;
  value: number;
  isDown: boolean;
  position?: Vector2;
  delta?: Vector2;
  area?: number;
  strength?: number;
}

export interface InternalTrackpadTouch extends TrackpadTouch {
  lastTimeDown?: number;
  delta?: Vector2;
}

export interface TrackpadBitmap {
  width: number;
  height: number;
  rows: Boolean[][];
}

export interface TrackpadSensorDataEventMessages {
  trackpadBitmaps: {
    trackpadBitmaps: TrackpadSensorEventMessages["trackpadBitmap"][];
  };
  trackpadTouches: {
    trackpadTouches: TrackpadSensorEventMessages["trackpadTouch"][];
  };
  trackpadTouchMovements: {
    trackpadTouchMovements: TrackpadSensorEventMessages["trackpadTouchMovement"][];
  };
  trackpadTouchPositions: {
    trackpadTouchPositions: TrackpadSensorEventMessages["trackpadTouchPosition"][];
  };
  trackpadGestures: {
    trackpadGestures: TrackpadSensorEventMessages["trackpadGesture"][];
  };
  trackpadTouchStrengths: {
    trackpadTouchStrengths: TrackpadSensorEventMessages["trackpadTouchStrength"][];
  };
  trackpadTouchAreas: {
    trackpadTouchAreas: TrackpadSensorEventMessages["trackpadTouchArea"][];
  };
}

export const TrackpadSensorEventTypes = [
  ...TrackpadSensorTypes,

  "trackpadsInformation",
  "trackpadInformation",

  "trackpadBitmap",
  "trackpadTouch",
  "trackpadTouchMovement",
  "trackpadTouchPosition",
  "trackpadGesture",
  "trackpadTouchStrength",
  "trackpadTouchArea",

  "trackpadTouchDown",
  "trackpadTouchUp",

  "trackpadTap",
  "trackpadSwipe",
  "trackpadSwipeLeft",
  "trackpadSwipeRight",
  "trackpadSwipeUp",
  "trackpadSwipeDown",
] as const;
export type TrackpadSensorEventType = (typeof TrackpadSensorEventTypes)[number];

export interface TrackpadSensorEventMessages {
  trackpadBitmap: {
    trackpadIndex: number;
    bitmap: TrackpadBitmap;
  };
  trackpadTouch: {
    trackpadIndex: number;
    touchIndex: number;
    value: number;
    isDown: boolean;
  };
  trackpadTouchMovement: {
    trackpadIndex: number;
    touchIndex: number;
    delta: Vector2;
  };
  trackpadTouchPosition: {
    trackpadIndex: number;
    touchIndex: number;
    position: Vector2;
  };
  trackpadGesture:
    | {
        trackpadIndex: number;
        gesture: TrackpadTapGesture;
        position: Vector2;
      }
    | {
        trackpadIndex: number;
        gesture: TrackpadSwipeGesture;
        delta: Vector2;
      };
  trackpadTouchStrength: {
    trackpadIndex: number;
    touchIndex: number;
    strength: number;
  };
  trackpadTouchArea: {
    trackpadIndex: number;
    touchIndex: number;
    area: number;
  };

  trackpadInformation: {
    trackpadInformation: TrackpadInformation;
  };
  trackpadsInformation: {
    trackpadsInformation: TrackpadsInformation;
  };
  trackpadTouchDown: {
    trackpadIndex: number;
    touchIndex: number;
    position?: Vector2;
  };
  trackpadTouchUp: {
    trackpadIndex: number;
    touchIndex: number;
    position?: Vector2;
  };
  trackpadTap: {
    trackpadIndex: number;
    gesture: TrackpadTapGesture;
    position: Vector2;
  };
  trackpadSwipe: {
    trackpadIndex: number;
    gesture: TrackpadSwipeGesture;
    delta: Vector2;
  };
  trackpadSwipeLeft: {
    trackpadIndex: number;
    gesture: TrackpadSwipeGesture;
    delta: Vector2;
  };
  trackpadSwipeRight: {
    trackpadIndex: number;
    gesture: TrackpadSwipeGesture;
    delta: Vector2;
  };
  trackpadSwipeUp: {
    trackpadIndex: number;
    gesture: TrackpadSwipeGesture;
    delta: Vector2;
  };
  trackpadSwipeDown: {
    trackpadIndex: number;
    gesture: TrackpadSwipeGesture;
    delta: Vector2;
  };
}

export type TrackpadSensorEventDispatcher = EventDispatcher<
  Device,
  TrackpadSensorEventType,
  TrackpadSensorEventMessages
>;

const _console = createConsole("TrackpadSensorDataManager", { log: true });

class TrackpadSensorDataManager {
  constructor() {
    autoBind(this);
  }

  #eventDispatcher!: TrackpadSensorEventDispatcher;
  get eventDispatcher() {
    return this.#eventDispatcher;
  }
  set eventDispatcher(eventDispatcher) {
    if (this.#eventDispatcher == eventDispatcher) {
      return;
    }
    _console.assertWithError(
      !this.#eventDispatcher,
      "eventDispatcher already defined",
    );
    this.#eventDispatcher = eventDispatcher;
  }
  get dispatchEvent() {
    return this.eventDispatcher.dispatchEvent;
  }

  #information: TrackpadsInformation = [];
  get information() {
    return this.#information;
  }
  get numberOfTrackPads() {
    return this.information.length;
  }
  parseInformation(dataView: DataView<ArrayBuffer>) {
    const trackpadsInformation: TrackpadsInformation = [];

    _console.log("parseInformation", dataView);

    let offset = 0;
    while (offset < dataView.byteLength) {
      const trackpadInformationLength = dataView.getUint8(offset++);
      const _finalOffset = offset + trackpadInformationLength;
      _console.assertWithError(
        _finalOffset <= dataView.byteLength,
        `invalid _finalOffset ${_finalOffset} (max ${dataView.byteLength})`,
      );

      let actualSize!: Size2;
      let bitmapSize: Size2 | undefined;

      while (offset < _finalOffset) {
        const typeIndex = dataView.getUint8(offset++);
        const type = TrackpadInformationTypes[typeIndex];
        _console.log({ type, typeIndex });
        _console.assertEnumWithError(TrackpadInformationTypes, type);
        switch (type) {
          case "actualSize":
            {
              const width = dataView.getUint16(offset, true);
              offset += 2;
              const height = dataView.getUint16(offset, true);
              offset += 2;
              actualSize = { width, height };
            }
            break;
          case "bitmapSize":
            {
              const width = dataView.getUint16(offset, true);
              offset += 2;
              const height = dataView.getUint16(offset, true);
              offset += 2;
              bitmapSize = { width, height };
            }
            break;
          default:
            _console.log(`uncaught information type "${type}"`);
            break;
        }
      }

      _console.assertWithError(actualSize, "actualSize is not included");
      const trackpadInformation: TrackpadInformation = {
        index: trackpadsInformation.length,
        actualSize,
        bitmapSize,
      };
      trackpadsInformation.push(trackpadInformation);
    }

    this.touches.length = 0;
    trackpadsInformation.forEach((_) => {
      this.touches.push([]);
    });

    _console.log("trackpadsInformation", ...trackpadsInformation);
    this.#information = trackpadsInformation.slice();

    trackpadsInformation.forEach((trackpadInformation) => {
      this.#eventDispatcher.dispatchEvent("trackpadInformation", {
        trackpadInformation,
      });
    });
    this.#eventDispatcher.dispatchEvent("trackpadsInformation", {
      trackpadsInformation,
    });
  }

  #touches: InternalTrackpadTouch[][] = [];
  get touches() {
    return this.#touches as TrackpadTouch[][];
  }

  #assertValidTrackpadIndex(trackpadIndex: number) {
    _console.assertWithError(
      this.numberOfTrackPads > 0,
      "no trackpads defined",
    );
    _console.assertRangeWithError(
      "trackpadIndex",
      trackpadIndex,
      0,
      this.numberOfTrackPads - 1,
    );
  }
  parseBitmaps(dataView: DataView<ArrayBuffer>) {
    const bitmaps: TrackpadSensorDataEventMessages["trackpadBitmaps"]["trackpadBitmaps"] =
      [];

    let offset = 0;
    while (offset < dataView.byteLength) {
      const trackpadIndex = dataView.getUint8(offset++);
      this.#assertValidTrackpadIndex(trackpadIndex);
      const rawBitmap = dataView.getUint32(offset, true);
      offset += 4;
      _console.log({ trackpadIndex, rawBitmap });

      const { width, height } = this.information[trackpadIndex].bitmapSize!;
      const rows: Boolean[][] = [];
      let bitOffset = 0;
      for (let y = 0; y < height; y++) {
        rows.push([]);
        for (let x = 0; x < width; x++) {
          rows[y][x] = Boolean(rawBitmap & (1 << bitOffset++));
        }
        if (bitOffset >= 32) {
          _console.log(`max bitOffset 32 reached (${bitOffset})`);
          break;
        }
      }
      const bitmap: TrackpadBitmap = {
        width,
        height,
        rows,
      };
      _console.log("bitmap", bitmap);

      const bitmapMessage = { trackpadIndex, bitmap };
      bitmaps.push(bitmapMessage);
    }

    bitmaps.forEach((bitmapMessage) => {
      this.#eventDispatcher.dispatchEvent("trackpadBitmap", bitmapMessage);
    });

    return bitmaps;
  }
  parseTouches(dataView: DataView<ArrayBuffer>) {
    const touchMessages: TrackpadSensorDataEventMessages["trackpadTouches"]["trackpadTouches"] =
      [];

    const touches: TrackpadTouch[] = [];
    let offset = 0;
    while (offset < dataView.byteLength) {
      const trackpadIndex = dataView.getUint8(offset++);
      this.#assertValidTrackpadIndex(trackpadIndex);

      const touchIndex = dataView.getUint8(offset++);

      const value = dataView.getUint8(offset++);
      const isDown = value > 0;

      const touch: TrackpadTouch = { trackpadIndex, touchIndex, value, isDown };
      _console.log("touch", touch);
      touches.push(touch);
    }

    touches.forEach((touch) => {
      const touchMessage = { ...touch };
      touchMessages.push(touchMessage);

      const { touchIndex, trackpadIndex } = touch;
      const trackpadTouches = this.#touches[trackpadIndex];
      const existingTouch = trackpadTouches.find(
        (_touch) => _touch.touchIndex == touchIndex,
      );
      if (existingTouch) {
        if (!touch.isDown) {
          _console.log("removing touch", existingTouch);
          trackpadTouches.splice(trackpadTouches.indexOf(existingTouch), 1);
          this.#eventDispatcher.dispatchEvent("trackpadTouchUp", touchMessage);
        }
      } else {
        if (touch.isDown) {
          _console.log("adding touch", touch);
          trackpadTouches.push(touch);
          this.#eventDispatcher.dispatchEvent("trackpadTouchUp", touchMessage);
        }
      }
    });

    touchMessages.forEach((touchMessage) => {
      this.#eventDispatcher.dispatchEvent("trackpadTouch", touchMessage);
    });

    return touchMessages;
  }
  parseTouchMovements(dataView: DataView<ArrayBuffer>, scalar: number) {
    const touchMovements: TrackpadSensorDataEventMessages["trackpadTouchMovements"]["trackpadTouchMovements"] =
      [];

    _console.log("parseTouchMovements", dataView, { scalar });

    let offset = 0;
    while (offset < dataView.byteLength) {
      const trackpadIndex = dataView.getUint8(offset++);
      this.#assertValidTrackpadIndex(trackpadIndex);

      const touchIndex = dataView.getUint8(offset++);

      const x = dataView.getInt16(offset, true) * scalar;
      offset += 2;
      const y = dataView.getInt16(offset, true) * scalar;
      offset += 2;

      const delta = { x, y };
      _console.log({ trackpadIndex, touchIndex, ...delta });
      touchMovements.push({ trackpadIndex, touchIndex, delta });
    }

    touchMovements.forEach((touchMovement) => {
      const touch = this.touches[touchMovement.trackpadIndex].find(
        (touch) => touch.touchIndex == touchMovement.touchIndex,
      );
      if (touch) {
        touch.delta = touchMovement.delta;
      }

      this.#eventDispatcher.dispatchEvent(
        "trackpadTouchMovement",
        touchMovement,
      );
    });

    return touchMovements;
  }
  parseTouchPositions(dataView: DataView<ArrayBuffer>, scalar: number) {
    const touchPositions: TrackpadSensorDataEventMessages["trackpadTouchPositions"]["trackpadTouchPositions"] =
      [];

    _console.log("parseTouchPositions", dataView, { scalar });

    let offset = 0;
    while (offset < dataView.byteLength) {
      const trackpadIndex = dataView.getUint8(offset++);
      this.#assertValidTrackpadIndex(trackpadIndex);

      const touchIndex = dataView.getUint8(offset++);

      const x = dataView.getUint16(offset, true) * scalar;
      offset += 2;
      const y = dataView.getUint16(offset, true) * scalar;
      offset += 2;

      const position = { x, y };
      _console.log({ trackpadIndex, touchIndex, ...position });
      touchPositions.push({ trackpadIndex, touchIndex, position });
    }

    touchPositions.forEach((touchPosition) => {
      const touch = this.touches[touchPosition.trackpadIndex].find(
        (touch) => touch.touchIndex == touchPosition.touchIndex,
      );
      if (touch) {
        touch.position = touchPosition.position;
      }

      this.#eventDispatcher.dispatchEvent(
        "trackpadTouchPosition",
        touchPosition,
      );
    });

    return touchPositions;
  }
  parseGestures(dataView: DataView<ArrayBuffer>, scalar: number) {
    const gestureMessage: TrackpadSensorDataEventMessages["trackpadGestures"]["trackpadGestures"] =
      [];

    let offset = 0;
    while (offset < dataView.byteLength) {
      const trackpadIndex = dataView.getUint8(offset++);
      this.#assertValidTrackpadIndex(trackpadIndex);

      const gestureIndex = dataView.getUint8(offset++);
      _console.log({ trackpadIndex, gestureIndex });
      const gesture = TrackpadGestures[gestureIndex];
      _console.assertEnumWithError(TrackpadGestures, gesture);
      _console.log({ gesture });

      if (TrackpadTapGestures.includes(gesture as TrackpadTapGesture)) {
        const x = dataView.getUint16(offset, true) * scalar;
        offset += 2;
        const y = dataView.getUint16(offset, true) * scalar;
        offset += 2;
        gestureMessage.push({
          trackpadIndex,
          gesture: gesture as TrackpadTapGesture,
          position: { x, y },
        });
      } else if (
        TrackpadSwipeGestures.includes(gesture as TrackpadSwipeGesture)
      ) {
        const x = dataView.getInt16(offset, true) * scalar;
        offset += 2;
        const y = dataView.getInt16(offset, true) * scalar;
        offset += 2;
        gestureMessage.push({
          trackpadIndex,
          gesture: gesture as TrackpadSwipeGesture,
          delta: { x, y },
        });
      } else {
        throw `uncaught gesture "${gesture}"`;
        // return { trackpadIndex, gesture };
      }
    }

    gestureMessage.forEach((gestureMessage) => {
      this.#eventDispatcher.dispatchEvent("trackpadGesture", gestureMessage);
      switch (gestureMessage.gesture) {
        case "tap":
          this.#eventDispatcher.dispatchEvent("trackpadTap", gestureMessage);
          break;
        case "swipeLeft":
          this.#eventDispatcher.dispatchEvent(
            "trackpadSwipeLeft",
            gestureMessage,
          );
          break;
        case "swipeRight":
          this.#eventDispatcher.dispatchEvent(
            "trackpadSwipeRight",
            gestureMessage,
          );
          break;
        case "swipeUp":
          this.#eventDispatcher.dispatchEvent(
            "trackpadSwipeUp",
            gestureMessage,
          );
          break;
        case "swipeDown":
          this.#eventDispatcher.dispatchEvent(
            "trackpadSwipeDown",
            gestureMessage,
          );
          break;
      }
      if (
        TrackpadSwipeGestures.includes(
          gestureMessage.gesture as TrackpadSwipeGesture,
        )
      ) {
        // @ts-expect-error
        this.#eventDispatcher.dispatchEvent("trackpadSwipe", gestureMessage);
      }
    });

    return gestureMessage;
  }
  parseTouchStrengths(dataView: DataView<ArrayBuffer>, scalar: number) {
    const touchStrengths: TrackpadSensorDataEventMessages["trackpadTouchStrengths"]["trackpadTouchStrengths"] =
      [];

    let offset = 0;
    while (offset < dataView.byteLength) {
      const trackpadIndex = dataView.getUint8(offset++);
      this.#assertValidTrackpadIndex(trackpadIndex);

      const touchIndex = dataView.getUint8(offset++);
      _console.log({ trackpadIndex, touchIndex });

      const strength = dataView.getUint16(offset, true) * scalar;
      offset += 2;

      _console.log({ trackpadIndex, touchIndex, strength });
      touchStrengths.push({ trackpadIndex, touchIndex, strength });
    }

    touchStrengths.forEach((touchStrength) => {
      const touch = this.touches[touchStrength.trackpadIndex].find(
        (touch) => touch.touchIndex == touchStrength.touchIndex,
      );
      if (touch) {
        touch.strength = touchStrength.strength;
      }

      this.#eventDispatcher.dispatchEvent(
        "trackpadTouchStrength",
        touchStrength,
      );
    });

    return touchStrengths;
  }
  parseTouchAreas(dataView: DataView<ArrayBuffer>, scalar: number) {
    const touchAreas: TrackpadSensorDataEventMessages["trackpadTouchAreas"]["trackpadTouchAreas"] =
      [];

    let offset = 0;
    while (offset < dataView.byteLength) {
      const trackpadIndex = dataView.getUint8(offset++);
      this.#assertValidTrackpadIndex(trackpadIndex);

      const touchIndex = dataView.getUint8(offset++);
      _console.log({ trackpadIndex, touchIndex });

      const area = dataView.getUint16(offset, true) * scalar;
      offset += 2;

      _console.log({ trackpadIndex, touchIndex, area });
      touchAreas.push({ trackpadIndex, touchIndex, area });
    }

    touchAreas.forEach((touchArea) => {
      const touch = this.touches[touchArea.trackpadIndex].find(
        (touch) => touch.touchIndex == touchArea.touchIndex,
      );
      if (touch) {
        touch.area = touchArea.area;
      }

      this.#eventDispatcher.dispatchEvent("trackpadTouchArea", touchArea);
    });

    return touchAreas;
  }

  clear() {
    _console.log("clear");
    this.#information.length = 0;
  }
}

export default TrackpadSensorDataManager;
