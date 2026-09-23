import { WebPlugin } from '@capacitor/core';
import type { BluetoothLowEnergyPlugin, InitializeOptions, IsAvailableResult, IsEnabledResult, IsLocationEnabledResult, PermissionStatus, StartScanOptions, ConnectOptions, DisconnectOptions, CreateBondOptions, IsBondedOptions, IsBondedResult, DiscoverServicesOptions, GetServicesOptions, GetServicesResult, GetConnectedDevicesResult, ReadCharacteristicOptions, ReadCharacteristicResult, WriteCharacteristicOptions, StartCharacteristicNotificationsOptions, StopCharacteristicNotificationsOptions, ReadDescriptorOptions, ReadDescriptorResult, WriteDescriptorOptions, ReadRssiOptions, ReadRssiResult, RequestMtuOptions, RequestMtuResult, RequestConnectionPriorityOptions, StartAdvertisingOptions, AddGattServiceOptions, RemoveGattServiceOptions, SetGattCharacteristicValueOptions, NotifyGattCharacteristicChangedOptions, StartForegroundServiceOptions, GetPluginVersionResult } from './definitions';
interface BluetoothDevice {
    id: string;
    name?: string;
    gatt?: BluetoothRemoteGATTServer;
}
interface BluetoothRemoteGATTServer {
    connected: boolean;
    connect(): Promise<BluetoothRemoteGATTServer>;
    disconnect(): void;
    getPrimaryServices(): Promise<BluetoothRemoteGATTService[]>;
    getPrimaryService(service: string): Promise<BluetoothRemoteGATTService>;
}
interface BluetoothRemoteGATTService {
    uuid: string;
    getCharacteristics(): Promise<BluetoothRemoteGATTCharacteristic[]>;
    getCharacteristic(characteristic: string): Promise<BluetoothRemoteGATTCharacteristic>;
}
interface BluetoothRemoteGATTCharacteristic {
    uuid: string;
    properties: {
        broadcast: boolean;
        read: boolean;
        writeWithoutResponse: boolean;
        write: boolean;
        notify: boolean;
        indicate: boolean;
        authenticatedSignedWrites: boolean;
        reliableWrite?: boolean;
        writableAuxiliaries?: boolean;
    };
    value?: DataView;
    getDescriptors(): Promise<BluetoothRemoteGATTDescriptor[]>;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
    writeValueWithResponse(value: BufferSource): Promise<void>;
    writeValueWithoutResponse(value: BufferSource): Promise<void>;
    startNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    stopNotifications(): Promise<BluetoothRemoteGATTCharacteristic>;
    addEventListener(type: string, listener: (event: Event & {
        target: BluetoothRemoteGATTCharacteristic;
    }) => void): void;
    removeEventListener(type: string, listener: (event: Event & {
        target: BluetoothRemoteGATTCharacteristic;
    }) => void): void;
}
interface BluetoothRemoteGATTDescriptor {
    uuid: string;
    value?: DataView;
    readValue(): Promise<DataView>;
    writeValue(value: BufferSource): Promise<void>;
}
interface Bluetooth {
    getAvailability(): Promise<boolean>;
    requestDevice(options: RequestDeviceOptions): Promise<BluetoothDevice>;
    getDevices?(): Promise<BluetoothDevice[]>;
    addEventListener(type: string, listener: (event: Event) => void): void;
    removeEventListener(type: string, listener: (event: Event) => void): void;
}
interface RequestDeviceOptions {
    filters?: {
        services?: string[];
        name?: string;
        namePrefix?: string;
    }[];
    optionalServices?: string[];
    acceptAllDevices?: boolean;
}
declare global {
    interface Navigator {
        bluetooth?: Bluetooth;
    }
}
export declare class BluetoothLowEnergyWeb extends WebPlugin implements BluetoothLowEnergyPlugin {
    private devices;
    private services;
    private characteristicListeners;
    initialize(_options?: InitializeOptions): Promise<void>;
    shimWebBluetooth(): void;
    isAvailable(): Promise<IsAvailableResult>;
    isEnabled(): Promise<IsEnabledResult>;
    isLocationEnabled(): Promise<IsLocationEnabledResult>;
    openAppSettings(): Promise<void>;
    openBluetoothSettings(): Promise<void>;
    openLocationSettings(): Promise<void>;
    checkPermissions(): Promise<PermissionStatus>;
    requestPermissions(): Promise<PermissionStatus>;
    startScan(options?: StartScanOptions): Promise<void>;
    stopScan(): Promise<void>;
    connect(options: ConnectOptions): Promise<void>;
    disconnect(options: DisconnectOptions): Promise<void>;
    createBond(_options: CreateBondOptions): Promise<void>;
    isBonded(_options: IsBondedOptions): Promise<IsBondedResult>;
    discoverServices(options: DiscoverServicesOptions): Promise<void>;
    getServices(options: GetServicesOptions): Promise<GetServicesResult>;
    getConnectedDevices(): Promise<GetConnectedDevicesResult>;
    readCharacteristic(options: ReadCharacteristicOptions): Promise<ReadCharacteristicResult>;
    writeCharacteristic(options: WriteCharacteristicOptions): Promise<void>;
    startCharacteristicNotifications(options: StartCharacteristicNotificationsOptions): Promise<void>;
    stopCharacteristicNotifications(options: StopCharacteristicNotificationsOptions): Promise<void>;
    readDescriptor(options: ReadDescriptorOptions): Promise<ReadDescriptorResult>;
    writeDescriptor(options: WriteDescriptorOptions): Promise<void>;
    readRssi(_options: ReadRssiOptions): Promise<ReadRssiResult>;
    requestMtu(_options: RequestMtuOptions): Promise<RequestMtuResult>;
    requestConnectionPriority(_options: RequestConnectionPriorityOptions): Promise<void>;
    startAdvertising(_options: StartAdvertisingOptions): Promise<void>;
    addGattService(_options: AddGattServiceOptions): Promise<void>;
    removeGattService(_options: RemoveGattServiceOptions): Promise<void>;
    setGattCharacteristicValue(_options: SetGattCharacteristicValueOptions): Promise<void>;
    notifyGattCharacteristicChanged(_options: NotifyGattCharacteristicChangedOptions): Promise<void>;
    stopAdvertising(): Promise<void>;
    startForegroundService(_options: StartForegroundServiceOptions): Promise<void>;
    stopForegroundService(): Promise<void>;
    getPluginVersion(): Promise<GetPluginVersionResult>;
}
export {};
