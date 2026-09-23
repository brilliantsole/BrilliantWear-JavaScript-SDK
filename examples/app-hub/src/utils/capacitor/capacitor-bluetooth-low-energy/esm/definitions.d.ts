import type { PluginListenerHandle } from '@capacitor/core';
/**
 * Capacitor Bluetooth Low Energy Plugin for BLE communication.
 *
 * @since 1.0.0
 */
export interface BluetoothLowEnergyPlugin {
    /**
     * Initialize the BLE plugin.
     * Must be called before any other method.
     *
     * @param options - Initialization options
     * @returns Promise that resolves when initialization is complete
     * @throws Error if initialization fails
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.initialize({ mode: 'central' });
     * ```
     */
    initialize(options?: InitializeOptions): Promise<void>;
    /**
     * Install the Capacitor Web Bluetooth shim on `navigator.bluetooth`.
     * Call this manually before using the Web Bluetooth API from a Capacitor native app.
     *
     * @since 1.0.0
     * @example
     * ```typescript
     * BluetoothLowEnergy.shimWebBluetooth();
     * ```
     */
    shimWebBluetooth(): void;
    /**
     * Check if Bluetooth is available on the device.
     *
     * @returns Promise that resolves with availability status
     * @since 1.0.0
     * @example
     * ```typescript
     * const { available } = await BluetoothLowEnergy.isAvailable();
     * ```
     */
    isAvailable(): Promise<IsAvailableResult>;
    /**
     * Check if Bluetooth is enabled on the device.
     *
     * @returns Promise that resolves with enabled status
     * @since 1.0.0
     * @example
     * ```typescript
     * const { enabled } = await BluetoothLowEnergy.isEnabled();
     * ```
     */
    isEnabled(): Promise<IsEnabledResult>;
    /**
     * Check if location services are enabled (Android only).
     *
     * @returns Promise that resolves with location enabled status
     * @since 1.0.0
     * @example
     * ```typescript
     * const { enabled } = await BluetoothLowEnergy.isLocationEnabled();
     * ```
     */
    isLocationEnabled(): Promise<IsLocationEnabledResult>;
    /**
     * Open the app settings page.
     *
     * @returns Promise that resolves when settings are opened
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.openAppSettings();
     * ```
     */
    openAppSettings(): Promise<void>;
    /**
     * Open the Bluetooth settings page (Android only).
     *
     * @returns Promise that resolves when settings are opened
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.openBluetoothSettings();
     * ```
     */
    openBluetoothSettings(): Promise<void>;
    /**
     * Open the location settings page (Android only).
     *
     * @returns Promise that resolves when settings are opened
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.openLocationSettings();
     * ```
     */
    openLocationSettings(): Promise<void>;
    /**
     * Check the current permission status.
     *
     * @returns Promise that resolves with permission status
     * @since 1.0.0
     * @example
     * ```typescript
     * const { bluetooth, location } = await BluetoothLowEnergy.checkPermissions();
     * ```
     */
    checkPermissions(): Promise<PermissionStatus>;
    /**
     * Request Bluetooth permissions.
     *
     * @returns Promise that resolves with permission status
     * @since 1.0.0
     * @example
     * ```typescript
     * const { bluetooth, location } = await BluetoothLowEnergy.requestPermissions();
     * ```
     */
    requestPermissions(): Promise<PermissionStatus>;
    /**
     * Start scanning for BLE devices.
     *
     * @param options - Scan options
     * @returns Promise that resolves when scanning starts
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.startScan({
     *   services: ['180D'], // Heart Rate Service
     *   timeout: 10000
     * });
     * ```
     */
    startScan(options?: StartScanOptions): Promise<void>;
    /**
     * Stop scanning for BLE devices.
     *
     * @returns Promise that resolves when scanning stops
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.stopScan();
     * ```
     */
    stopScan(): Promise<void>;
    /**
     * Connect to a BLE device.
     *
     * @param options - Connection options
     * @returns Promise that resolves when connected
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.connect({ deviceId: 'AA:BB:CC:DD:EE:FF' });
     * ```
     */
    connect(options: ConnectOptions): Promise<void>;
    /**
     * Disconnect from a BLE device.
     *
     * @param options - Disconnect options
     * @returns Promise that resolves when disconnected
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.disconnect({ deviceId: 'AA:BB:CC:DD:EE:FF' });
     * ```
     */
    disconnect(options: DisconnectOptions): Promise<void>;
    /**
     * Create a bond with a BLE device (Android only).
     *
     * @param options - Bond options
     * @returns Promise that resolves when bond is created
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.createBond({ deviceId: 'AA:BB:CC:DD:EE:FF' });
     * ```
     */
    createBond(options: CreateBondOptions): Promise<void>;
    /**
     * Check if a device is bonded (Android only).
     *
     * @param options - Bond check options
     * @returns Promise that resolves with bonded status
     * @since 1.0.0
     * @example
     * ```typescript
     * const { bonded } = await BluetoothLowEnergy.isBonded({ deviceId: 'AA:BB:CC:DD:EE:FF' });
     * ```
     */
    isBonded(options: IsBondedOptions): Promise<IsBondedResult>;
    /**
     * Discover services on a connected device.
     *
     * @param options - Discover options
     * @returns Promise that resolves when discovery is complete
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.discoverServices({ deviceId: 'AA:BB:CC:DD:EE:FF' });
     * ```
     */
    discoverServices(options: DiscoverServicesOptions): Promise<void>;
    /**
     * Get discovered services for a device.
     *
     * @param options - Get services options
     * @returns Promise that resolves with services list
     * @since 1.0.0
     * @example
     * ```typescript
     * const { services } = await BluetoothLowEnergy.getServices({ deviceId: 'AA:BB:CC:DD:EE:FF' });
     * ```
     */
    getServices(options: GetServicesOptions): Promise<GetServicesResult>;
    /**
     * Get a list of connected devices.
     *
     * @returns Promise that resolves with connected devices
     * @since 1.0.0
     * @example
     * ```typescript
     * const { devices } = await BluetoothLowEnergy.getConnectedDevices();
     * ```
     */
    getConnectedDevices(): Promise<GetConnectedDevicesResult>;
    /**
     * Read a characteristic value.
     *
     * @param options - Read options
     * @returns Promise that resolves with the characteristic value
     * @since 1.0.0
     * @example
     * ```typescript
     * const { value } = await BluetoothLowEnergy.readCharacteristic({
     *   deviceId: 'AA:BB:CC:DD:EE:FF',
     *   service: '180D',
     *   characteristic: '2A37'
     * });
     * ```
     */
    readCharacteristic(options: ReadCharacteristicOptions): Promise<ReadCharacteristicResult>;
    /**
     * Write a value to a characteristic.
     *
     * @param options - Write options
     * @returns Promise that resolves when write is complete
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.writeCharacteristic({
     *   deviceId: 'AA:BB:CC:DD:EE:FF',
     *   service: '180D',
     *   characteristic: '2A39',
     *   value: [0x01]
     * });
     * ```
     */
    writeCharacteristic(options: WriteCharacteristicOptions): Promise<void>;
    /**
     * Start notifications for a characteristic.
     *
     * @param options - Notification options
     * @returns Promise that resolves when notifications start
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.startCharacteristicNotifications({
     *   deviceId: 'AA:BB:CC:DD:EE:FF',
     *   service: '180D',
     *   characteristic: '2A37'
     * });
     * ```
     */
    startCharacteristicNotifications(options: StartCharacteristicNotificationsOptions): Promise<void>;
    /**
     * Stop notifications for a characteristic.
     *
     * @param options - Stop notification options
     * @returns Promise that resolves when notifications stop
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.stopCharacteristicNotifications({
     *   deviceId: 'AA:BB:CC:DD:EE:FF',
     *   service: '180D',
     *   characteristic: '2A37'
     * });
     * ```
     */
    stopCharacteristicNotifications(options: StopCharacteristicNotificationsOptions): Promise<void>;
    /**
     * Read a descriptor value.
     *
     * @param options - Read descriptor options
     * @returns Promise that resolves with the descriptor value
     * @since 1.0.0
     * @example
     * ```typescript
     * const { value } = await BluetoothLowEnergy.readDescriptor({
     *   deviceId: 'AA:BB:CC:DD:EE:FF',
     *   service: '180D',
     *   characteristic: '2A37',
     *   descriptor: '2902'
     * });
     * ```
     */
    readDescriptor(options: ReadDescriptorOptions): Promise<ReadDescriptorResult>;
    /**
     * Write a value to a descriptor.
     *
     * @param options - Write descriptor options
     * @returns Promise that resolves when write is complete
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.writeDescriptor({
     *   deviceId: 'AA:BB:CC:DD:EE:FF',
     *   service: '180D',
     *   characteristic: '2A37',
     *   descriptor: '2902',
     *   value: [0x01, 0x00]
     * });
     * ```
     */
    writeDescriptor(options: WriteDescriptorOptions): Promise<void>;
    /**
     * Read the RSSI (signal strength) of a connected device.
     *
     * @param options - Read RSSI options
     * @returns Promise that resolves with the RSSI value
     * @since 1.0.0
     * @example
     * ```typescript
     * const { rssi } = await BluetoothLowEnergy.readRssi({ deviceId: 'AA:BB:CC:DD:EE:FF' });
     * ```
     */
    readRssi(options: ReadRssiOptions): Promise<ReadRssiResult>;
    /**
     * Request MTU size change (Android only).
     *
     * @param options - Request MTU options
     * @returns Promise that resolves with the new MTU value
     * @since 1.0.0
     * @example
     * ```typescript
     * const { mtu } = await BluetoothLowEnergy.requestMtu({
     *   deviceId: 'AA:BB:CC:DD:EE:FF',
     *   mtu: 512
     * });
     * ```
     */
    requestMtu(options: RequestMtuOptions): Promise<RequestMtuResult>;
    /**
     * Request connection priority (Android only).
     *
     * @param options - Request priority options
     * @returns Promise that resolves when priority is set
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.requestConnectionPriority({
     *   deviceId: 'AA:BB:CC:DD:EE:FF',
     *   priority: 'high'
     * });
     * ```
     */
    requestConnectionPriority(options: RequestConnectionPriorityOptions): Promise<void>;
    /**
     * Start advertising as a peripheral (BLE server).
     *
     * @param options - Advertising options
     * @returns Promise that resolves when advertising starts
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.startAdvertising({
     *   name: 'MyDevice',
     *   services: ['180D']
     * });
     * ```
     */
    startAdvertising(options: StartAdvertisingOptions): Promise<void>;
    /**
     * Stop advertising.
     *
     * @returns Promise that resolves when advertising stops
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.stopAdvertising();
     * ```
     */
    stopAdvertising(): Promise<void>;
    /**
     * Add a GATT service with characteristics to the local GATT server.
     * Must be called in peripheral mode before starting advertising.
     *
     * @param options - GATT service definition
     * @returns Promise that resolves when the service is added
     * @since 8.2.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.addGattService({
     *   service: '180D',
     *   characteristics: [{
     *     uuid: '2A37',
     *     properties: { read: true, notify: true, write: false, writeWithoutResponse: false, broadcast: false, indicate: false, authenticatedSignedWrites: false, extendedProperties: false },
     *     value: [0x00]
     *   }]
     * });
     * ```
     */
    addGattService(options: AddGattServiceOptions): Promise<void>;
    /**
     * Remove a GATT service from the local GATT server.
     *
     * @param options - Service removal options
     * @returns Promise that resolves when the service is removed
     * @since 8.2.0
     */
    removeGattService(options: RemoveGattServiceOptions): Promise<void>;
    /**
     * Set the value of a local GATT characteristic.
     *
     * @param options - Characteristic value options
     * @returns Promise that resolves when the value is set
     * @since 8.2.0
     */
    setGattCharacteristicValue(options: SetGattCharacteristicValueOptions): Promise<void>;
    /**
     * Notify connected centrals that a local GATT characteristic value changed.
     *
     * @param options - Notification options
     * @returns Promise that resolves when the notification is sent
     * @since 8.2.0
     */
    notifyGattCharacteristicChanged(options: NotifyGattCharacteristicChangedOptions): Promise<void>;
    /**
     * Start a foreground service to maintain BLE connections in background (Android only).
     *
     * @param options - Foreground service options
     * @returns Promise that resolves when service starts
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.startForegroundService({
     *   title: 'BLE Connection',
     *   body: 'Maintaining connection...'
     * });
     * ```
     */
    startForegroundService(options: StartForegroundServiceOptions): Promise<void>;
    /**
     * Stop the foreground service (Android only).
     *
     * @returns Promise that resolves when service stops
     * @since 1.0.0
     * @example
     * ```typescript
     * await BluetoothLowEnergy.stopForegroundService();
     * ```
     */
    stopForegroundService(): Promise<void>;
    /**
     * Get the native Capacitor plugin version.
     *
     * @returns Promise that resolves with the plugin version
     * @since 1.0.0
     * @example
     * ```typescript
     * const { version } = await BluetoothLowEnergy.getPluginVersion();
     * ```
     */
    getPluginVersion(): Promise<GetPluginVersionResult>;
    /**
     * Add a listener for device scanned events.
     *
     * @param eventName - The event name
     * @param listenerFunc - The listener function
     * @returns Promise that resolves with a handle to remove the listener
     * @since 1.0.0
     */
    addListener(eventName: 'deviceScanned', listenerFunc: (event: DeviceScannedEvent) => void): Promise<PluginListenerHandle>;
    /**
     * Add a listener for device connected events.
     *
     * @param eventName - The event name
     * @param listenerFunc - The listener function
     * @returns Promise that resolves with a handle to remove the listener
     * @since 1.0.0
     */
    addListener(eventName: 'deviceConnected', listenerFunc: (event: DeviceConnectedEvent) => void): Promise<PluginListenerHandle>;
    /**
     * Add a listener for device disconnected events.
     *
     * @param eventName - The event name
     * @param listenerFunc - The listener function
     * @returns Promise that resolves with a handle to remove the listener
     * @since 1.0.0
     */
    addListener(eventName: 'deviceDisconnected', listenerFunc: (event: DeviceDisconnectedEvent) => void): Promise<PluginListenerHandle>;
    /**
     * Add a listener for characteristic changed events.
     *
     * @param eventName - The event name
     * @param listenerFunc - The listener function
     * @returns Promise that resolves with a handle to remove the listener
     * @since 1.0.0
     */
    addListener(eventName: 'characteristicChanged', listenerFunc: (event: CharacteristicChangedEvent) => void): Promise<PluginListenerHandle>;
    /**
     * Add a listener for central connected events (peripheral mode).
     *
     * @param eventName - The event name
     * @param listenerFunc - The listener function
     * @returns Promise that resolves with a handle to remove the listener
     * @since 8.2.0
     */
    addListener(eventName: 'centralConnected', listenerFunc: (event: CentralConnectedEvent) => void): Promise<PluginListenerHandle>;
    /**
     * Add a listener for central disconnected events (peripheral mode).
     *
     * @param eventName - The event name
     * @param listenerFunc - The listener function
     * @returns Promise that resolves with a handle to remove the listener
     * @since 8.2.0
     */
    addListener(eventName: 'centralDisconnected', listenerFunc: (event: CentralDisconnectedEvent) => void): Promise<PluginListenerHandle>;
    /**
     * Add a listener for GATT characteristic read requests (peripheral mode).
     *
     * @param eventName - The event name
     * @param listenerFunc - The listener function
     * @returns Promise that resolves with a handle to remove the listener
     * @since 8.2.0
     */
    addListener(eventName: 'gattCharacteristicReadRequest', listenerFunc: (event: GattCharacteristicReadRequestEvent) => void): Promise<PluginListenerHandle>;
    /**
     * Add a listener for GATT characteristic write requests (peripheral mode).
     *
     * @param eventName - The event name
     * @param listenerFunc - The listener function
     * @returns Promise that resolves with a handle to remove the listener
     * @since 8.2.0
     */
    addListener(eventName: 'gattCharacteristicWriteRequest', listenerFunc: (event: GattCharacteristicWriteRequestEvent) => void): Promise<PluginListenerHandle>;
    /**
     * Remove all listeners for this plugin.
     *
     * @returns Promise that resolves when all listeners are removed
     * @since 1.0.0
     */
    removeAllListeners(): Promise<void>;
}
/**
 * Initialization options for the plugin.
 *
 * @since 1.0.0
 */
export interface InitializeOptions {
    /**
     * The mode to initialize the plugin in.
     * - 'central': Act as a BLE central (client)
     * - 'peripheral': Act as a BLE peripheral (server)
     *
     * @default 'central'
     * @since 1.0.0
     */
    mode?: 'central' | 'peripheral';
    /**
     * Whether iOS should show the system Bluetooth power alert when Bluetooth is off (iOS only).
     *
     * @default true
     * @since 8.0.7
     */
    showPowerAlert?: boolean;
}
/**
 * Result of the isAvailable method.
 *
 * @since 1.0.0
 */
export interface IsAvailableResult {
    /**
     * Whether Bluetooth is available on the device.
     *
     * @since 1.0.0
     */
    available: boolean;
}
/**
 * Result of the isEnabled method.
 *
 * @since 1.0.0
 */
export interface IsEnabledResult {
    /**
     * Whether Bluetooth is enabled on the device.
     *
     * @since 1.0.0
     */
    enabled: boolean;
}
/**
 * Result of the isLocationEnabled method.
 *
 * @since 1.0.0
 */
export interface IsLocationEnabledResult {
    /**
     * Whether location services are enabled on the device.
     *
     * @since 1.0.0
     */
    enabled: boolean;
}
/**
 * Permission status for Bluetooth and location.
 *
 * @since 1.0.0
 */
export interface PermissionStatus {
    /**
     * Bluetooth permission status.
     *
     * @since 1.0.0
     */
    bluetooth: PermissionState;
    /**
     * Location permission status (Android only).
     *
     * @since 1.0.0
     */
    location: PermissionState;
}
/**
 * Permission state values.
 *
 * @since 1.0.0
 */
export type PermissionState = 'prompt' | 'prompt-with-rationale' | 'granted' | 'denied';
/**
 * Options for starting a scan.
 *
 * @since 1.0.0
 */
export interface StartScanOptions {
    /**
     * List of service UUIDs to filter by.
     * Only devices advertising these services will be returned.
     *
     * @since 1.0.0
     */
    services?: string[];
    /**
     * Scan timeout in milliseconds.
     * Set to 0 for no timeout.
     *
     * @default 0
     * @since 1.0.0
     */
    timeout?: number;
    /**
     * Whether to allow duplicate scan results.
     *
     * @default false
     * @since 1.0.0
     */
    allowDuplicates?: boolean;
}
/**
 * Options for connecting to a device.
 *
 * @since 1.0.0
 */
export interface ConnectOptions {
    /**
     * The device ID (MAC address on Android, UUID on iOS).
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * Whether to automatically connect when the device becomes available.
     *
     * @default false
     * @since 1.0.0
     */
    autoConnect?: boolean;
}
/**
 * Options for disconnecting from a device.
 *
 * @since 1.0.0
 */
export interface DisconnectOptions {
    /**
     * The device ID to disconnect from.
     *
     * @since 1.0.0
     */
    deviceId: string;
}
/**
 * Options for creating a bond.
 *
 * @since 1.0.0
 */
export interface CreateBondOptions {
    /**
     * The device ID to bond with.
     *
     * @since 1.0.0
     */
    deviceId: string;
}
/**
 * Options for checking bond status.
 *
 * @since 1.0.0
 */
export interface IsBondedOptions {
    /**
     * The device ID to check.
     *
     * @since 1.0.0
     */
    deviceId: string;
}
/**
 * Result of the isBonded method.
 *
 * @since 1.0.0
 */
export interface IsBondedResult {
    /**
     * Whether the device is bonded.
     *
     * @since 1.0.0
     */
    bonded: boolean;
}
/**
 * Options for discovering services.
 *
 * @since 1.0.0
 */
export interface DiscoverServicesOptions {
    /**
     * The device ID to discover services on.
     *
     * @since 1.0.0
     */
    deviceId: string;
}
/**
 * Options for getting services.
 *
 * @since 1.0.0
 */
export interface GetServicesOptions {
    /**
     * The device ID to get services for.
     *
     * @since 1.0.0
     */
    deviceId: string;
}
/**
 * Result of the getServices method.
 *
 * @since 1.0.0
 */
export interface GetServicesResult {
    /**
     * List of discovered services.
     *
     * @since 1.0.0
     */
    services: BleService[];
}
/**
 * A BLE service.
 *
 * @since 1.0.0
 */
export interface BleService {
    /**
     * The service UUID.
     *
     * @since 1.0.0
     */
    uuid: string;
    /**
     * List of characteristics in this service.
     *
     * @since 1.0.0
     */
    characteristics: BleCharacteristic[];
}
/**
 * A BLE characteristic.
 *
 * @since 1.0.0
 */
export interface BleCharacteristic {
    /**
     * The characteristic UUID.
     *
     * @since 1.0.0
     */
    uuid: string;
    /**
     * Properties of this characteristic.
     *
     * @since 1.0.0
     */
    properties: CharacteristicProperties;
    /**
     * List of descriptors in this characteristic.
     *
     * @since 1.0.0
     */
    descriptors: BleDescriptor[];
}
/**
 * Properties of a BLE characteristic.
 *
 * @since 1.0.0
 */
export interface CharacteristicProperties {
    /**
     * Whether the characteristic supports broadcast.
     *
     * @since 1.0.0
     */
    broadcast: boolean;
    /**
     * Whether the characteristic supports read.
     *
     * @since 1.0.0
     */
    read: boolean;
    /**
     * Whether the characteristic supports write without response.
     *
     * @since 1.0.0
     */
    writeWithoutResponse: boolean;
    /**
     * Whether the characteristic supports write.
     *
     * @since 1.0.0
     */
    write: boolean;
    /**
     * Whether the characteristic supports notify.
     *
     * @since 1.0.0
     */
    notify: boolean;
    /**
     * Whether the characteristic supports indicate.
     *
     * @since 1.0.0
     */
    indicate: boolean;
    /**
     * Whether the characteristic supports authenticated signed writes.
     *
     * @since 1.0.0
     */
    authenticatedSignedWrites: boolean;
    /**
     * Whether the characteristic has extended properties.
     *
     * @since 1.0.0
     */
    extendedProperties: boolean;
}
/**
 * A BLE descriptor.
 *
 * @since 1.0.0
 */
export interface BleDescriptor {
    /**
     * The descriptor UUID.
     *
     * @since 1.0.0
     */
    uuid: string;
}
/**
 * Result of the getConnectedDevices method.
 *
 * @since 1.0.0
 */
export interface GetConnectedDevicesResult {
    /**
     * List of connected devices.
     *
     * @since 1.0.0
     */
    devices: BleDevice[];
}
/**
 * A BLE device.
 *
 * @since 1.0.0
 */
export interface BleDevice {
    /**
     * The device ID (MAC address on Android, UUID on iOS).
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The device name (may be null if not available).
     *
     * @since 1.0.0
     */
    name: string | null;
    /**
     * The RSSI (signal strength) at time of discovery.
     *
     * @since 1.0.0
     */
    rssi?: number;
    /**
     * Manufacturer data from advertisement (as hex string).
     *
     * @since 1.0.0
     */
    manufacturerData?: string;
    /**
     * Service UUIDs advertised by the device.
     *
     * @since 1.0.0
     */
    serviceUuids?: string[];
}
/**
 * Options for reading a characteristic.
 *
 * @since 1.0.0
 */
export interface ReadCharacteristicOptions {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The service UUID.
     *
     * @since 1.0.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 1.0.0
     */
    characteristic: string;
}
/**
 * Result of reading a characteristic.
 *
 * @since 1.0.0
 */
export interface ReadCharacteristicResult {
    /**
     * The characteristic value as an array of bytes.
     *
     * @since 1.0.0
     */
    value: number[];
}
/**
 * Options for writing to a characteristic.
 *
 * @since 1.0.0
 */
export interface WriteCharacteristicOptions {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The service UUID.
     *
     * @since 1.0.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 1.0.0
     */
    characteristic: string;
    /**
     * The value to write as an array of bytes.
     *
     * @since 1.0.0
     */
    value: number[];
    /**
     * Write type.
     *
     * @default 'withResponse'
     * @since 1.0.0
     */
    type?: 'withResponse' | 'withoutResponse';
}
/**
 * Options for starting characteristic notifications.
 *
 * @since 1.0.0
 */
export interface StartCharacteristicNotificationsOptions {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The service UUID.
     *
     * @since 1.0.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 1.0.0
     */
    characteristic: string;
}
/**
 * Options for stopping characteristic notifications.
 *
 * @since 1.0.0
 */
export interface StopCharacteristicNotificationsOptions {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The service UUID.
     *
     * @since 1.0.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 1.0.0
     */
    characteristic: string;
}
/**
 * Options for reading a descriptor.
 *
 * @since 1.0.0
 */
export interface ReadDescriptorOptions {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The service UUID.
     *
     * @since 1.0.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 1.0.0
     */
    characteristic: string;
    /**
     * The descriptor UUID.
     *
     * @since 1.0.0
     */
    descriptor: string;
}
/**
 * Result of reading a descriptor.
 *
 * @since 1.0.0
 */
export interface ReadDescriptorResult {
    /**
     * The descriptor value as an array of bytes.
     *
     * @since 1.0.0
     */
    value: number[];
}
/**
 * Options for writing to a descriptor.
 *
 * @since 1.0.0
 */
export interface WriteDescriptorOptions {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The service UUID.
     *
     * @since 1.0.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 1.0.0
     */
    characteristic: string;
    /**
     * The descriptor UUID.
     *
     * @since 1.0.0
     */
    descriptor: string;
    /**
     * The value to write as an array of bytes.
     *
     * @since 1.0.0
     */
    value: number[];
}
/**
 * Options for reading RSSI.
 *
 * @since 1.0.0
 */
export interface ReadRssiOptions {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
}
/**
 * Result of reading RSSI.
 *
 * @since 1.0.0
 */
export interface ReadRssiResult {
    /**
     * The RSSI value in dBm.
     *
     * @since 1.0.0
     */
    rssi: number;
}
/**
 * Options for requesting MTU.
 *
 * @since 1.0.0
 */
export interface RequestMtuOptions {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The requested MTU size.
     *
     * @since 1.0.0
     */
    mtu: number;
}
/**
 * Result of requesting MTU.
 *
 * @since 1.0.0
 */
export interface RequestMtuResult {
    /**
     * The negotiated MTU size.
     *
     * @since 1.0.0
     */
    mtu: number;
}
/**
 * Options for requesting connection priority.
 *
 * @since 1.0.0
 */
export interface RequestConnectionPriorityOptions {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The requested connection priority.
     *
     * @since 1.0.0
     */
    priority: 'low' | 'balanced' | 'high';
}
/**
 * Options for starting advertising.
 *
 * @since 1.0.0
 */
export interface StartAdvertisingOptions {
    /**
     * The device name to advertise.
     *
     * On Android, advertising the local name is implemented by temporarily setting the Bluetooth adapter name
     * while advertising, then restoring the previous adapter name when advertising is stopped.
     *
     * @since 1.0.0
     */
    name?: string;
    /**
     * Service UUIDs to advertise.
     *
     * @since 1.0.0
     */
    services?: string[];
    /**
     * Whether to include the device name in the advertisement.
     *
     * @default true
     * @since 1.0.0
     */
    includeName?: boolean;
    /**
     * Whether to include TX power level in the advertisement.
     *
     * @default false
     * @since 1.0.0
     */
    includeTxPowerLevel?: boolean;
}
/**
 * Options for starting the foreground service.
 *
 * @since 1.0.0
 */
export interface StartForegroundServiceOptions {
    /**
     * The notification title.
     *
     * @since 1.0.0
     */
    title: string;
    /**
     * The notification body.
     *
     * @since 1.0.0
     */
    body: string;
    /**
     * The notification small icon resource name.
     *
     * @since 1.0.0
     */
    smallIcon?: string;
}
/**
 * Result of getPluginVersion.
 *
 * @since 1.0.0
 */
export interface GetPluginVersionResult {
    /**
     * The plugin version.
     *
     * @since 1.0.0
     */
    version: string;
}
/**
 * Event emitted when a device is scanned.
 *
 * @since 1.0.0
 */
export interface DeviceScannedEvent {
    /**
     * The scanned device.
     *
     * @since 1.0.0
     */
    device: BleDevice;
}
/**
 * Event emitted when a device is connected.
 *
 * @since 1.0.0
 */
export interface DeviceConnectedEvent {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
}
/**
 * Event emitted when a device is disconnected.
 *
 * @since 1.0.0
 */
export interface DeviceDisconnectedEvent {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
}
/**
 * Event emitted when a characteristic value changes.
 *
 * @since 1.0.0
 */
export interface CharacteristicChangedEvent {
    /**
     * The device ID.
     *
     * @since 1.0.0
     */
    deviceId: string;
    /**
     * The service UUID.
     *
     * @since 1.0.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 1.0.0
     */
    characteristic: string;
    /**
     * The new value as an array of bytes.
     *
     * @since 1.0.0
     */
    value: number[];
}
/**
 * Utility class for BLE operations.
 *
 * @since 1.0.0
 */
/**
 * A GATT characteristic definition for the local GATT server.
 *
 * @since 8.2.0
 */
export interface GattCharacteristicDefinition {
    /**
     * The characteristic UUID.
     *
     * @since 8.2.0
     */
    uuid: string;
    /**
     * Properties of this characteristic.
     *
     * @since 8.2.0
     */
    properties: CharacteristicProperties;
    /**
     * Initial value as an array of bytes.
     *
     * @since 8.2.0
     */
    value?: number[];
    /**
     * Optional descriptors for this characteristic.
     *
     * @since 8.2.0
     */
    descriptors?: GattDescriptorDefinition[];
}
/**
 * A GATT descriptor definition for the local GATT server.
 *
 * @since 8.2.0
 */
export interface GattDescriptorDefinition {
    /**
     * The descriptor UUID.
     *
     * @since 8.2.0
     */
    uuid: string;
    /**
     * Initial value as an array of bytes.
     *
     * @since 8.2.0
     */
    value?: number[];
}
/**
 * Options for adding a GATT service.
 *
 * @since 8.2.0
 */
export interface AddGattServiceOptions {
    /**
     * The service UUID.
     *
     * @since 8.2.0
     */
    service: string;
    /**
     * Characteristics to expose in this service.
     *
     * @since 8.2.0
     */
    characteristics: GattCharacteristicDefinition[];
}
/**
 * Options for removing a GATT service.
 *
 * @since 8.2.0
 */
export interface RemoveGattServiceOptions {
    /**
     * The service UUID.
     *
     * @since 8.2.0
     */
    service: string;
}
/**
 * Options for setting a local GATT characteristic value.
 *
 * @since 8.2.0
 */
export interface SetGattCharacteristicValueOptions {
    /**
     * The service UUID.
     *
     * @since 8.2.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 8.2.0
     */
    characteristic: string;
    /**
     * The value as an array of bytes.
     *
     * @since 8.2.0
     */
    value: number[];
}
/**
 * Options for notifying connected centrals of a characteristic change.
 *
 * @since 8.2.0
 */
export interface NotifyGattCharacteristicChangedOptions {
    /**
     * The service UUID.
     *
     * @since 8.2.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 8.2.0
     */
    characteristic: string;
    /**
     * The value as an array of bytes.
     *
     * @since 8.2.0
     */
    value: number[];
    /**
     * Optional central device ID. When omitted, all subscribed centrals are notified.
     *
     * @since 8.2.0
     */
    deviceId?: string;
}
/**
 * Event emitted when a central connects to the local GATT server.
 *
 * @since 8.2.0
 */
export interface CentralConnectedEvent {
    /**
     * The central device ID.
     *
     * @since 8.2.0
     */
    deviceId: string;
}
/**
 * Event emitted when a central disconnects from the local GATT server.
 *
 * @since 8.2.0
 */
export interface CentralDisconnectedEvent {
    /**
     * The central device ID.
     *
     * @since 8.2.0
     */
    deviceId: string;
}
/**
 * Event emitted when a central reads a local GATT characteristic.
 *
 * @since 8.2.0
 */
export interface GattCharacteristicReadRequestEvent {
    /**
     * The central device ID.
     *
     * @since 8.2.0
     */
    deviceId: string;
    /**
     * The service UUID.
     *
     * @since 8.2.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 8.2.0
     */
    characteristic: string;
}
/**
 * Event emitted when a central writes to a local GATT characteristic.
 *
 * @since 8.2.0
 */
export interface GattCharacteristicWriteRequestEvent {
    /**
     * The central device ID.
     *
     * @since 8.2.0
     */
    deviceId: string;
    /**
     * The service UUID.
     *
     * @since 8.2.0
     */
    service: string;
    /**
     * The characteristic UUID.
     *
     * @since 8.2.0
     */
    characteristic: string;
    /**
     * The written value as an array of bytes.
     *
     * @since 8.2.0
     */
    value: number[];
}
export declare class BluetoothLowEnergyUtils {
    /**
     * Convert a byte array to a hex string.
     *
     * @param bytes - The byte array to convert
     * @returns The hex string
     * @since 1.0.0
     * @example
     * ```typescript
     * const hex = BluetoothLowEnergyUtils.convertBytesToHex([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
     * console.log(hex); // "48656c6c6f"
     * ```
     */
    static convertBytesToHex(bytes: number[]): string;
    /**
     * Convert a hex string to a byte array.
     *
     * @param hex - The hex string to convert
     * @returns The byte array
     * @since 1.0.0
     * @example
     * ```typescript
     * const bytes = BluetoothLowEnergyUtils.convertHexToBytes("48656c6c6f");
     * console.log(bytes); // [72, 101, 108, 108, 111]
     * ```
     */
    static convertHexToBytes(hex: string): number[];
    /**
     * Convert a string to a byte array (UTF-8).
     *
     * @param str - The string to convert
     * @returns The byte array
     * @since 1.0.0
     * @example
     * ```typescript
     * const bytes = BluetoothLowEnergyUtils.convertStringToBytes("Hello");
     * console.log(bytes); // [72, 101, 108, 108, 111]
     * ```
     */
    static convertStringToBytes(str: string): number[];
    /**
     * Convert a byte array to a string (UTF-8).
     *
     * @param bytes - The byte array to convert
     * @returns The string
     * @since 1.0.0
     * @example
     * ```typescript
     * const str = BluetoothLowEnergyUtils.convertBytesToString([72, 101, 108, 108, 111]);
     * console.log(str); // "Hello"
     * ```
     */
    static convertBytesToString(bytes: number[]): string;
}
