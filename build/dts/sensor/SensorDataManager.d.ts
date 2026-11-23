import { Euler } from "../utils/MathUtils.ts";
import PressureSensorDataManager, { PressureDataEventMessages, PressureSensorEventMessages } from "./PressureSensorDataManager.ts";
import MotionSensorDataManager, { MotionSensorDataEventMessages } from "./MotionSensorDataManager.ts";
import BarometerSensorDataManager, { BarometerSensorDataEventMessages } from "./BarometerSensorDataManager.ts";
import EventDispatcher from "../utils/EventDispatcher.ts";
import ButtonSensorDataManager, { ButtonSensorDataEventMessages, ButtonSensorEventMessages } from "./ButtonSensorDataManager.ts";
import TouchSensorDataManager, { TouchSensorDataEventMessages, TouchSensorEventMessages } from "./TouchSensorDataManager.ts";
import Device from "../Device.ts";
import { AddKeysAsPropertyToInterface, ExtendInterfaceValues, ValueOf } from "../utils/TypeScriptUtils.ts";
import LightSensorDataManager, { LightSensorDataEventMessages } from "./LightSensorDataManager.ts";
import TrackpadSensorDataManager, { TrackpadMessageType, TrackpadSensorDataEventMessages, TrackpadSensorEventMessages } from "./TrackpadSensorDataManager.ts";
export declare const SensorTypes: readonly ["pressure", "acceleration", "gravity", "linearAcceleration", "gyroscope", "magnetometer", "gameRotation", "rotation", "orientation", "activity", "stepCounter", "stepDetector", "deviceOrientation", "tapDetector", "barometer", "camera", "microphone", "buttons", "touches", "light", "trackpadBitmaps", "trackpadTouches", "trackpadTouchMovements", "trackpadTouchPositions", "trackpadGestures", "trackpadTouchStrengths", "trackpadTouchAreas"];
export type SensorType = (typeof SensorTypes)[number];
export declare const ContinuousSensorTypes: readonly ["pressure", "acceleration", "gravity", "linearAcceleration", "gyroscope", "magnetometer", "gameRotation", "rotation", "orientation", "barometer", "light"];
export type ContinuousSensorType = (typeof ContinuousSensorTypes)[number];
export declare const SensorDataMessageTypes: readonly ["getPressurePositions", "getSensorScalars", "sensorData"];
export type SensorDataMessageType = (typeof SensorDataMessageTypes)[number];
export declare const RequiredPressureMessageTypes: SensorDataMessageType[];
export declare const SensorDataEventTypes: readonly ["getPressurePositions", "getSensorScalars", "sensorData", "pressure", "acceleration", "gravity", "linearAcceleration", "gyroscope", "magnetometer", "gameRotation", "rotation", "orientation", "activity", "stepCounter", "stepDetector", "deviceOrientation", "tapDetector", "barometer", "camera", "microphone", "buttons", "touches", "light", "trackpadBitmaps", "trackpadTouches", "trackpadTouchMovements", "trackpadTouchPositions", "trackpadGestures", "trackpadTouchStrengths", "trackpadTouchAreas", "pressureAutoRangeEnabled", "pressureAutoRangeDisabled", "pressureAutoRange", "pressureMotionAutoRangeEnabled", "pressureMotionAutoRangeDisabled", "pressureMotionAutoRange", "isRecordingPressureCalibrationData", "pressureCalibrationDataRecordStart", "pressureCalibrationDataRecordStop", "pressureCalibrationDataRecordingProgress", "isTrainingPressureCalibration", "pressureCalibrationTrainStart", "pressureCalibrationTrainEnd", "pressureCalibrationTrainProgress", "calibratedPressureModel", "numberOfButtons", "button", "buttonDown", "buttonUp", "numberOfTouches", "touch", "touchDown", "touchUp", "trackpadBitmaps", "trackpadTouches", "trackpadTouchMovements", "trackpadTouchPositions", "trackpadGestures", "trackpadTouchStrengths", "trackpadTouchAreas", "trackpadsInformation", "trackpadInformation", "trackpadBitmap", "trackpadTouch", "trackpadTouchMovement", "trackpadTouchPosition", "trackpadGesture", "trackpadTouchStrength", "trackpadTouchArea", "trackpadTouchDown", "trackpadTouchUp", "trackpadTap", "trackpadSwipe", "trackpadSwipeLeft", "trackpadSwipeRight", "trackpadSwipeUp", "trackpadSwipeDown"];
export type SensorDataEventType = (typeof SensorDataEventTypes)[number];
export interface BaseSensorDataEventMessage {
    timestamp: number;
    isLast: boolean;
}
export type BaseSensorDataEventMessages = BarometerSensorDataEventMessages & MotionSensorDataEventMessages & PressureDataEventMessages & ButtonSensorDataEventMessages & TouchSensorDataEventMessages & LightSensorDataEventMessages & TrackpadSensorDataEventMessages;
type _SensorDataEventMessages = ExtendInterfaceValues<AddKeysAsPropertyToInterface<BaseSensorDataEventMessages, "sensorType">, BaseSensorDataEventMessage>;
export type SensorDataEventMessage = ValueOf<_SensorDataEventMessages>;
interface AnySensorDataEventMessages {
    sensorData: SensorDataEventMessage;
    isLast: boolean;
}
export type SensorDataEventMessages = (_SensorDataEventMessages & AnySensorDataEventMessages) & PressureSensorEventMessages & ButtonSensorEventMessages & TouchSensorEventMessages & TrackpadSensorEventMessages;
export type SensorDataEventDispatcher = EventDispatcher<Device, SensorDataEventType, SensorDataEventMessages>;
export type SensorDataParseContext = {
    timestamp: number;
    euler?: Euler;
    messages: {
        [T in keyof _SensorDataEventMessages]: {
            sensorType: T;
            message: _SensorDataEventMessages[T];
            dataView?: DataView<ArrayBuffer>;
        };
    }[keyof _SensorDataEventMessages][];
};
export declare const SensorMetaDataMessageTypes: readonly ["getSensorCounts"];
export type SensorMetaDataMessageType = (typeof SensorMetaDataMessageTypes)[number];
export declare const RequiredSensorMetaDataMessageTypes: SensorMetaDataMessageType[];
export declare const SensorMetaDataEventTypes: readonly ["getSensorCounts"];
export type SensorMetaDataEventType = (typeof SensorMetaDataEventTypes)[number];
export interface SensorMetaDataEventMessages {
}
export type SensorMetaDataEventDispatcher = EventDispatcher<Device, SensorMetaDataEventType, SensorMetaDataEventMessages>;
export declare function parseSensorData(dataView: DataView<ArrayBuffer>, callback: (sensorType: SensorType, dataView: DataView<ArrayBuffer>, context: SensorDataParseContext, isLast?: boolean) => void): SensorDataParseContext;
declare class SensorDataManager {
    #private;
    constructor();
    pressureSensorDataManager: PressureSensorDataManager;
    motionSensorDataManager: MotionSensorDataManager;
    barometerSensorDataManager: BarometerSensorDataManager;
    buttonSensorDataManager: ButtonSensorDataManager;
    touchSensorDataManager: TouchSensorDataManager;
    lightSensorDataManager: LightSensorDataManager;
    trackpadSensorDataManager: TrackpadSensorDataManager;
    static AssertValidSensorType(sensorType: SensorType): void;
    static AssertValidSensorTypeEnum(sensorTypeEnum: number): void;
    get eventDispatcher(): SensorDataEventDispatcher & SensorMetaDataEventDispatcher;
    set eventDispatcher(eventDispatcher: SensorDataEventDispatcher & SensorMetaDataEventDispatcher);
    get dispatchEvent(): (<T extends "pressureAutoRangeEnabled" | "pressureAutoRangeDisabled" | "pressureAutoRange" | "pressureMotionAutoRangeEnabled" | "pressureMotionAutoRangeDisabled" | "pressureMotionAutoRange" | "isRecordingPressureCalibrationData" | "pressureCalibrationDataRecordStart" | "pressureCalibrationDataRecordStop" | "pressureCalibrationDataRecordingProgress" | "isTrainingPressureCalibration" | "pressureCalibrationTrainStart" | "pressureCalibrationTrainEnd" | "pressureCalibrationTrainProgress" | "calibratedPressureModel" | "pressure" | "acceleration" | "gravity" | "linearAcceleration" | "gyroscope" | "magnetometer" | "gameRotation" | "rotation" | "orientation" | "activity" | "stepCounter" | "stepDetector" | "deviceOrientation" | "tapDetector" | "barometer" | "buttons" | "numberOfButtons" | "button" | "buttonDown" | "buttonUp" | "touches" | "numberOfTouches" | "touch" | "touchDown" | "touchUp" | "microphone" | "light" | "trackpadBitmaps" | "trackpadTouches" | "trackpadTouchMovements" | "trackpadTouchPositions" | "trackpadGestures" | "trackpadTouchStrengths" | "trackpadTouchAreas" | "trackpadsInformation" | "trackpadBitmap" | "trackpadTouch" | "trackpadTouchMovement" | "trackpadTouchPosition" | "trackpadGesture" | "trackpadTouchStrength" | "trackpadTouchArea" | "trackpadInformation" | "trackpadTouchDown" | "trackpadTouchUp" | "trackpadTap" | "trackpadSwipe" | "trackpadSwipeLeft" | "trackpadSwipeRight" | "trackpadSwipeUp" | "trackpadSwipeDown" | "camera" | "getPressurePositions" | "getSensorScalars" | "sensorData">(type: T, message: SensorDataEventMessages[T]) => void) & (<T extends "getSensorCounts">(type: T, message: SensorMetaDataEventMessages[T]) => void);
    parseMessage(messageType: SensorDataMessageType | SensorMetaDataMessageType | TrackpadMessageType, dataView: DataView<ArrayBuffer>, isSending?: boolean): void;
    allSensorTypes: SensorType[];
    clear(): void;
}
export default SensorDataManager;
