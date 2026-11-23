import Device from "../Device.ts";
import EventDispatcher from "../utils/EventDispatcher.ts";
import { Size2, Vector2 } from "../utils/MathUtils.ts";
export declare const TrackpadSensorTypes: readonly ["trackpadBitmaps", "trackpadTouches", "trackpadTouchMovements", "trackpadTouchPositions", "trackpadGestures", "trackpadTouchStrengths", "trackpadTouchAreas"];
export type TrackpadSensorType = (typeof TrackpadSensorTypes)[number];
export declare const TrackpadTapGestures: readonly ["tap"];
export type TrackpadTapGesture = (typeof TrackpadTapGestures)[number];
export declare const TrackpadSwipeGestures: readonly ["swipeLeft", "swipeRight", "swipeUp", "swipeDown"];
export type TrackpadSwipeGesture = (typeof TrackpadSwipeGestures)[number];
export declare const TrackpadGestures: readonly ["tap", "swipeLeft", "swipeRight", "swipeUp", "swipeDown"];
export type TrackpadGesture = (typeof TrackpadGestures)[number];
export declare const TrackpadInformationTypes: readonly ["actualSize", "bitmapSize"];
export type TrackpadInformationType = (typeof TrackpadInformationTypes)[number];
export declare const TrackpadMessageTypes: readonly ["trackpadsInformation"];
export type TrackpadMessageType = (typeof TrackpadMessageTypes)[number];
export declare const RequiredTrackpadMessageTypes: TrackpadMessageType[];
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
export declare const TrackpadSensorEventTypes: readonly ["trackpadBitmaps", "trackpadTouches", "trackpadTouchMovements", "trackpadTouchPositions", "trackpadGestures", "trackpadTouchStrengths", "trackpadTouchAreas", "trackpadsInformation", "trackpadInformation", "trackpadBitmap", "trackpadTouch", "trackpadTouchMovement", "trackpadTouchPosition", "trackpadGesture", "trackpadTouchStrength", "trackpadTouchArea", "trackpadTouchDown", "trackpadTouchUp", "trackpadTap", "trackpadSwipe", "trackpadSwipeLeft", "trackpadSwipeRight", "trackpadSwipeUp", "trackpadSwipeDown"];
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
    trackpadGesture: {
        trackpadIndex: number;
        gesture: TrackpadTapGesture;
        position: Vector2;
    } | {
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
export type TrackpadSensorEventDispatcher = EventDispatcher<Device, TrackpadSensorEventType, TrackpadSensorEventMessages>;
declare class TrackpadSensorDataManager {
    #private;
    constructor();
    get eventDispatcher(): TrackpadSensorEventDispatcher;
    set eventDispatcher(eventDispatcher: TrackpadSensorEventDispatcher);
    get dispatchEvent(): <T extends "trackpadBitmaps" | "trackpadTouches" | "trackpadTouchMovements" | "trackpadTouchPositions" | "trackpadGestures" | "trackpadTouchStrengths" | "trackpadTouchAreas" | "trackpadsInformation" | "trackpadBitmap" | "trackpadTouch" | "trackpadTouchMovement" | "trackpadTouchPosition" | "trackpadGesture" | "trackpadTouchStrength" | "trackpadTouchArea" | "trackpadInformation" | "trackpadTouchDown" | "trackpadTouchUp" | "trackpadTap" | "trackpadSwipe" | "trackpadSwipeLeft" | "trackpadSwipeRight" | "trackpadSwipeUp" | "trackpadSwipeDown">(type: T, message: TrackpadSensorEventMessages[T]) => void;
    get information(): TrackpadsInformation;
    get numberOfTrackPads(): number;
    parseInformation(dataView: DataView<ArrayBuffer>): void;
    get touches(): TrackpadTouch[][];
    parseBitmaps(dataView: DataView<ArrayBuffer>): {
        trackpadIndex: number;
        bitmap: TrackpadBitmap;
    }[];
    parseTouches(dataView: DataView<ArrayBuffer>): {
        trackpadIndex: number;
        touchIndex: number;
        value: number;
        isDown: boolean;
    }[];
    parseTouchMovements(dataView: DataView<ArrayBuffer>, scalar: number): {
        trackpadIndex: number;
        touchIndex: number;
        delta: Vector2;
    }[];
    parseTouchPositions(dataView: DataView<ArrayBuffer>, scalar: number): {
        trackpadIndex: number;
        touchIndex: number;
        position: Vector2;
    }[];
    parseGestures(dataView: DataView<ArrayBuffer>, scalar: number): ({
        trackpadIndex: number;
        gesture: TrackpadTapGesture;
        position: Vector2;
    } | {
        trackpadIndex: number;
        gesture: TrackpadSwipeGesture;
        delta: Vector2;
    })[];
    parseTouchStrengths(dataView: DataView<ArrayBuffer>, scalar: number): {
        trackpadIndex: number;
        touchIndex: number;
        strength: number;
    }[];
    parseTouchAreas(dataView: DataView<ArrayBuffer>, scalar: number): {
        trackpadIndex: number;
        touchIndex: number;
        area: number;
    }[];
    clear(): void;
}
export default TrackpadSensorDataManager;
