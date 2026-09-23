'use strict';

var core = require('@capacitor/core');

const PLUGIN_NAME = 'BluetoothLowEnergy';
const DEFAULT_SCAN_TIMEOUT = 15000;
const BLUETOOTH_BASE_UUID_SUFFIX = '-0000-1000-8000-00805f9b34fb';
const BLUETOOTH_SERVICE_UUID_ALIASES = {
    alert_notification: 0x1811,
    automation_io: 0x1815,
    battery_service: 0x180f,
    binary_sensor: 0x183b,
    blood_pressure: 0x1810,
    body_composition: 0x181b,
    bond_management: 0x181e,
    continuous_glucose_monitoring: 0x181f,
    coordinated_set_identification_service: 0x1846,
    current_time: 0x1805,
    cycling_power: 0x1818,
    cycling_speed_and_cadence: 0x1816,
    device_information: 0x180a,
    device_time: 0x1847,
    emergency_configuration: 0x183c,
    environmental_sensing: 0x181a,
    fitness_machine: 0x1826,
    generic_access: 0x1800,
    generic_attribute: 0x1801,
    generic_media_control_service: 0x1849,
    generic_telephone_bearer_service: 0x184c,
    glucose: 0x1808,
    health_thermometer: 0x1809,
    heart_rate: 0x180d,
    http_proxy: 0x1823,
    human_interface_device: 0x1812,
    immediate_alert: 0x1802,
    indoor_positioning: 0x1821,
    insulin_delivery: 0x183a,
    internet_protocol_support: 0x1820,
    link_loss: 0x1803,
    location_and_navigation: 0x1819,
    media_control_service: 0x1848,
    mesh_provisioning: 0x1827,
    mesh_proxy: 0x1828,
    microphone_control: 0x184d,
    next_dst_change: 0x1807,
    object_transfer: 0x1825,
    phone_alert_status: 0x180e,
    physical_activity_monitor: 0x183e,
    pulse_oximeter: 0x1822,
    reconnection_configuration: 0x1829,
    reference_time_update: 0x1806,
    running_speed_and_cadence: 0x1814,
    scan_parameters: 0x1813,
    transport_discovery: 0x1824,
    tx_power: 0x1804,
    user_data: 0x181c,
    volume_control: 0x1844,
    volume_offset_control: 0x1845,
    weight_scale: 0x181d,
};
class ShimEventEmitter {
    constructor() {
        this.listeners = new Map();
    }
    addEventListener(type, listener) {
        var _a;
        if (!type) {
            return;
        }
        const typeListeners = (_a = this.listeners.get(type)) !== null && _a !== void 0 ? _a : new Set();
        typeListeners.add(listener);
        this.listeners.set(type, typeListeners);
    }
    removeEventListener(type, listener) {
        const typeListeners = this.listeners.get(type);
        if (!typeListeners) {
            return;
        }
        typeListeners.delete(listener);
        if (typeListeners.size === 0) {
            this.listeners.delete(type);
        }
    }
    dispatchShimEvent(type, target) {
        const event = { type, target };
        const typeListeners = this.listeners.get(type);
        typeListeners === null || typeListeners === void 0 ? void 0 : typeListeners.forEach((listener) => {
            listener(event);
        });
        const handler = target[`on${type}`];
        if (typeof handler === 'function') {
            handler(event);
        }
    }
}
class NativeWebBluetoothShim {
    constructor(root, plugin) {
        this.root = root;
        this.plugin = plugin;
        this.initializedPromise = null;
        this.listenersPromise = null;
        this.pendingRequest = null;
        this.deviceCache = new Map();
        this.characteristicCache = new Map();
        this.exposedDeviceIds = new Set();
        this.listenerHandles = [];
    }
    install() {
        var _a;
        var _b;
        if (this.root.__capgoBluetoothLowEnergyShimInstalled || !this.root.navigator || this.root.navigator.bluetooth) {
            return;
        }
        const bluetooth = new BluetoothShimFacade(this);
        Object.defineProperty(this.root.navigator, 'bluetooth', {
            configurable: true,
            enumerable: true,
            value: bluetooth,
            writable: false,
        });
        this.root.BluetoothDevice = BluetoothDeviceShim;
        this.root.BluetoothRemoteGATTServer = BluetoothRemoteGATTServerShim;
        this.root.BluetoothRemoteGATTService = BluetoothRemoteGATTServiceShim;
        this.root.BluetoothRemoteGATTCharacteristic = BluetoothRemoteGATTCharacteristicShim;
        this.root.BluetoothRemoteGATTDescriptor = BluetoothRemoteGATTDescriptorShim;
        (_a = (_b = this.root).BluetoothUUID) !== null && _a !== void 0 ? _a : (_b.BluetoothUUID = {
            canonicalUUID,
            getService: canonicalUUID,
            getCharacteristic: canonicalUUID,
            getDescriptor: canonicalUUID,
        });
        this.root.__capgoBluetoothLowEnergyShimInstalled = true;
    }
    async getAvailability() {
        await this.ensureInitialized();
        const { available } = await this.plugin.isAvailable();
        return available === true;
    }
    async getDevices() {
        await this.ensureInitialized();
        await this.ensureListeners();
        const { devices } = await this.plugin.getConnectedDevices();
        devices.forEach((deviceData) => {
            const device = this.getOrCreateDevice(deviceData);
            device.gatt.setConnected(true);
            this.exposedDeviceIds.add(device.id);
        });
        return Array.from(this.exposedDeviceIds)
            .map((deviceId) => this.deviceCache.get(deviceId))
            .filter((device) => typeof device !== 'undefined');
    }
    async requestDevice(options) {
        var _a;
        if (!options || (options.acceptAllDevices !== true && (!options.filters || options.filters.length === 0))) {
            throw new TypeError('requestDevice requires filters or acceptAllDevices: true.');
        }
        if (options.acceptAllDevices !== true &&
            ((_a = options.filters) === null || _a === void 0 ? void 0 : _a.some((filter) => (!filter.services || filter.services.length === 0) &&
                typeof filter.name !== 'string' &&
                typeof filter.namePrefix !== 'string'))) {
            throw new TypeError('requestDevice filters must specify a name, namePrefix, or at least one service.');
        }
        if (this.pendingRequest) {
            throw createBluetoothError('InvalidStateError', 'A Bluetooth request is already in progress.');
        }
        await this.ensureListeners();
        await this.ensureScanPrerequisites();
        await this.stopScanSilently();
        return new Promise((resolve, reject) => {
            const timeoutId = setTimeout(() => {
                if (!this.pendingRequest) {
                    return;
                }
                this.pendingRequest = null;
                void this.stopScanSilently();
                reject(createBluetoothError('NotFoundError', 'No matching Bluetooth device was found.'));
            }, DEFAULT_SCAN_TIMEOUT);
            this.pendingRequest = {
                options,
                reject,
                resolve: (device) => {
                    device.gatt.setConnected(false);
                    resolve(device);
                },
                timeoutId,
            };
            void this.plugin
                .startScan({
                allowDuplicates: true,
                services: mergeRequestedServices(options.filters),
                timeout: DEFAULT_SCAN_TIMEOUT,
            })
                .catch((error) => {
                if (!this.pendingRequest) {
                    return;
                }
                clearTimeout(timeoutId);
                this.pendingRequest = null;
                reject(normalizeError(error));
            });
        });
    }
    async connectDevice(device) {
        await this.ensureInitialized();
        await this.ensureListeners();
        await this.plugin.connect({ deviceId: device.id });
        device.gatt.setConnected(true);
        device.setServices(null);
        return device.gatt;
    }
    disconnectDevice(device) {
        if (!device.gatt.connected) {
            return;
        }
        device.gatt.setConnected(false);
        device.setServices(null);
        void this.plugin.disconnect({ deviceId: device.id }).catch(() => undefined);
    }
    async getPrimaryServices(device, serviceUuid) {
        const services = await this.ensureServices(device);
        const mapped = services.map((serviceData) => new BluetoothRemoteGATTServiceShim(this, device, serviceData));
        if (typeof serviceUuid === 'undefined') {
            return mapped;
        }
        const normalized = normalizeUuid(serviceUuid);
        return mapped.filter((service) => normalizeUuid(service.uuid) === normalized);
    }
    async getPrimaryService(device, serviceUuid) {
        const services = await this.getPrimaryServices(device, serviceUuid);
        const service = services[0];
        if (!service) {
            throw createBluetoothError('NotFoundError', 'Requested Bluetooth service was not found.');
        }
        return service;
    }
    async getCharacteristics(device, serviceUuid, characteristicUuid) {
        const service = await this.findService(device, serviceUuid);
        const characteristics = service.characteristics.map((characteristicData) => {
            const characteristic = this.getOrCreateCharacteristic(device, service.uuid, characteristicData);
            characteristic.service = new BluetoothRemoteGATTServiceShim(this, device, service);
            return characteristic;
        });
        if (typeof characteristicUuid === 'undefined') {
            return characteristics;
        }
        const normalizedCharacteristicUuid = normalizeUuid(characteristicUuid);
        return characteristics.filter((characteristic) => normalizeUuid(characteristic.uuid) === normalizedCharacteristicUuid);
    }
    async getCharacteristic(device, serviceUuid, characteristicUuid) {
        const { characteristic, service } = await this.findCharacteristic(device, serviceUuid, characteristicUuid);
        const shim = this.getOrCreateCharacteristic(device, service.uuid, characteristic);
        shim.service = new BluetoothRemoteGATTServiceShim(this, device, service);
        return shim;
    }
    async getDescriptors(device, serviceUuid, characteristicUuid, descriptorUuid) {
        const { characteristic } = await this.findCharacteristic(device, serviceUuid, characteristicUuid);
        const normalizedDescriptorUuid = descriptorUuid ? normalizeUuid(descriptorUuid) : null;
        return characteristic.descriptors
            .filter((descriptorData) => {
            if (!normalizedDescriptorUuid) {
                return true;
            }
            return normalizeUuid(descriptorData.uuid) === normalizedDescriptorUuid;
        })
            .map((descriptorData) => {
            const descriptor = new BluetoothRemoteGATTDescriptorShim(this, device, normalizeUuid(serviceUuid), normalizeUuid(characteristicUuid), descriptorData);
            return descriptor;
        });
    }
    async getDescriptor(device, serviceUuid, characteristicUuid, descriptorUuid) {
        const descriptor = (await this.getDescriptors(device, serviceUuid, characteristicUuid, descriptorUuid))[0];
        if (!descriptor) {
            throw createBluetoothError('NotFoundError', 'Requested Bluetooth descriptor was not found.');
        }
        return descriptor;
    }
    async readCharacteristic(device, serviceUuid, characteristicUuid) {
        const { value } = await this.plugin.readCharacteristic({
            characteristic: normalizeUuid(characteristicUuid),
            deviceId: device.id,
            service: normalizeUuid(serviceUuid),
        });
        return toDataView(value);
    }
    async writeCharacteristic(device, serviceUuid, characteristicUuid, value, type) {
        await this.plugin.writeCharacteristic({
            characteristic: normalizeUuid(characteristicUuid),
            deviceId: device.id,
            service: normalizeUuid(serviceUuid),
            type,
            value: Array.from(toUint8Array(value)),
        });
    }
    async startNotifications(device, serviceUuid, characteristicUuid) {
        await this.ensureListeners();
        await this.plugin.startCharacteristicNotifications({
            characteristic: normalizeUuid(characteristicUuid),
            deviceId: device.id,
            service: normalizeUuid(serviceUuid),
        });
    }
    async stopNotifications(device, serviceUuid, characteristicUuid) {
        await this.plugin.stopCharacteristicNotifications({
            characteristic: normalizeUuid(characteristicUuid),
            deviceId: device.id,
            service: normalizeUuid(serviceUuid),
        });
    }
    async readDescriptor(device, serviceUuid, characteristicUuid, descriptorUuid) {
        const { value } = await this.plugin.readDescriptor({
            characteristic: normalizeUuid(characteristicUuid),
            descriptor: normalizeUuid(descriptorUuid),
            deviceId: device.id,
            service: normalizeUuid(serviceUuid),
        });
        return toDataView(value);
    }
    async writeDescriptor(device, serviceUuid, characteristicUuid, descriptorUuid, value) {
        await this.plugin.writeDescriptor({
            characteristic: normalizeUuid(characteristicUuid),
            descriptor: normalizeUuid(descriptorUuid),
            deviceId: device.id,
            service: normalizeUuid(serviceUuid),
            value: Array.from(toUint8Array(value)),
        });
    }
    async ensureInitialized() {
        if (!this.initializedPromise) {
            this.initializedPromise = this.plugin.initialize({ mode: 'central' }).catch((error) => {
                this.initializedPromise = null;
                throw normalizeError(error);
            });
        }
        await this.initializedPromise;
    }
    async ensureListeners() {
        if (!this.listenersPromise) {
            this.listenersPromise = Promise.all([
                this.plugin.addListener('deviceScanned', (event) => this.handleDeviceScanned(event)),
                this.plugin.addListener('deviceDisconnected', (event) => this.handleDeviceDisconnected(event)),
                this.plugin.addListener('characteristicChanged', (event) => this.handleCharacteristicChanged(event)),
            ]).then((handles) => {
                this.listenerHandles.push(...handles);
            });
        }
        await this.listenersPromise;
    }
    handleDeviceScanned(event) {
        if (!this.pendingRequest || !event.device) {
            return;
        }
        if (!matchesRequestOptions(event.device, this.pendingRequest.options)) {
            return;
        }
        const device = this.getOrCreateDevice(event.device);
        this.exposedDeviceIds.add(device.id);
        const request = this.pendingRequest;
        this.pendingRequest = null;
        clearTimeout(request.timeoutId);
        void this.stopScanSilently();
        request.resolve(device);
    }
    handleDeviceDisconnected(event) {
        const device = this.deviceCache.get(event.deviceId);
        device === null || device === void 0 ? void 0 : device.notifyDisconnected();
    }
    handleCharacteristicChanged(event) {
        const key = createCharacteristicKey(event.deviceId, event.service, event.characteristic);
        const characteristic = this.characteristicCache.get(key);
        characteristic === null || characteristic === void 0 ? void 0 : characteristic.handleValueChange(event.value);
    }
    async ensureScanPrerequisites() {
        if (!(await this.getAvailability())) {
            throw createBluetoothError('NotSupportedError', 'Bluetooth Low Energy is not available on this device.');
        }
        const { enabled } = await this.plugin.isEnabled();
        if (!enabled) {
            throw createBluetoothError('NotFoundError', 'Bluetooth is disabled on this device.');
        }
        const permissions = await this.plugin.requestPermissions();
        if (permissions.bluetooth === 'denied' || permissions.location === 'denied') {
            throw createBluetoothError('NotAllowedError', 'Bluetooth permissions were denied.');
        }
        const location = await this.plugin.isLocationEnabled();
        if (location.enabled === false) {
            throw createBluetoothError('NotFoundError', 'Location services must be enabled for Bluetooth scanning.');
        }
    }
    async ensureServices(device) {
        const cachedServices = device.getServices();
        if (cachedServices) {
            return cachedServices;
        }
        if (!device.gatt.connected) {
            throw createBluetoothError('NetworkError', 'Device is not connected.');
        }
        await this.plugin.discoverServices({ deviceId: device.id });
        const { services } = await this.plugin.getServices({ deviceId: device.id });
        device.setServices(services);
        return services;
    }
    async findService(device, serviceUuid) {
        const services = await this.ensureServices(device);
        const normalized = normalizeUuid(serviceUuid);
        const service = services.find((entry) => normalizeUuid(entry.uuid) === normalized);
        if (!service) {
            throw createBluetoothError('NotFoundError', 'Requested Bluetooth service was not found.');
        }
        return service;
    }
    async findCharacteristic(device, serviceUuid, characteristicUuid) {
        const service = await this.findService(device, serviceUuid);
        const normalized = normalizeUuid(characteristicUuid);
        const characteristic = service.characteristics.find((entry) => normalizeUuid(entry.uuid) === normalized);
        if (!characteristic) {
            throw createBluetoothError('NotFoundError', 'Requested Bluetooth characteristic was not found.');
        }
        return { characteristic, service };
    }
    getOrCreateDevice(deviceData) {
        const existingDevice = this.deviceCache.get(deviceData.deviceId);
        if (existingDevice) {
            existingDevice.updateMetadata(deviceData);
            return existingDevice;
        }
        const device = new BluetoothDeviceShim(this, deviceData);
        this.deviceCache.set(deviceData.deviceId, device);
        return device;
    }
    getOrCreateCharacteristic(device, serviceUuid, characteristicData) {
        const key = createCharacteristicKey(device.id, serviceUuid, characteristicData.uuid);
        const existingCharacteristic = this.characteristicCache.get(key);
        if (existingCharacteristic) {
            existingCharacteristic.update(characteristicData);
            return existingCharacteristic;
        }
        const characteristic = new BluetoothRemoteGATTCharacteristicShim(this, device, serviceUuid, characteristicData);
        this.characteristicCache.set(key, characteristic);
        return characteristic;
    }
    async stopScanSilently() {
        try {
            await this.plugin.stopScan();
        }
        catch (_a) {
            // Ignore stale scan errors.
        }
    }
}
class BluetoothDeviceShim extends ShimEventEmitter {
    constructor(shim, deviceData) {
        super();
        this.services = null;
        this.id = deviceData.deviceId;
        this.name = deviceData.name;
        this.gatt = new BluetoothRemoteGATTServerShim(shim, this);
        this.updateMetadata(deviceData);
    }
    updateMetadata(deviceData) {
        this.name = deviceData.name;
        this.rssi = deviceData.rssi;
        this.manufacturerData = deviceData.manufacturerData;
        this.serviceUuids = deviceData.serviceUuids;
    }
    getServices() {
        return this.services;
    }
    setServices(services) {
        this.services = services;
    }
    notifyDisconnected() {
        this.gatt.setConnected(false);
        this.services = null;
        this.dispatchShimEvent('gattserverdisconnected', this);
    }
    async watchAdvertisements() {
        throw createBluetoothError('NotSupportedError', 'watchAdvertisements is not implemented by the Capacitor shim.');
    }
}
class BluetoothRemoteGATTServerShim {
    constructor(shim, device) {
        this.shim = shim;
        this.device = device;
        this.connected = false;
    }
    setConnected(connected) {
        this.connected = connected;
    }
    async connect() {
        return this.shim.connectDevice(this.device);
    }
    disconnect() {
        this.shim.disconnectDevice(this.device);
    }
    async getPrimaryServices(serviceUuid) {
        return this.shim.getPrimaryServices(this.device, serviceUuid);
    }
    async getPrimaryService(serviceUuid) {
        return this.shim.getPrimaryService(this.device, serviceUuid);
    }
}
class BluetoothRemoteGATTServiceShim {
    constructor(shim, device, serviceData) {
        this.shim = shim;
        this.device = device;
        this.serviceData = serviceData;
        this.isPrimary = true;
    }
    get uuid() {
        return this.serviceData.uuid;
    }
    async getCharacteristics(characteristicUuid) {
        return this.shim.getCharacteristics(this.device, this.uuid, characteristicUuid);
    }
    async getCharacteristic(characteristicUuid) {
        return this.shim.getCharacteristic(this.device, this.uuid, characteristicUuid);
    }
}
class BluetoothRemoteGATTCharacteristicShim extends ShimEventEmitter {
    constructor(shim, device, serviceUuid, characteristicData) {
        super();
        this.shim = shim;
        this.device = device;
        this.serviceUuid = serviceUuid;
        this.characteristicData = characteristicData;
        this.service = null;
        this.value = null;
    }
    get uuid() {
        return this.characteristicData.uuid;
    }
    get properties() {
        return this.characteristicData.properties;
    }
    update(characteristicData) {
        this.characteristicData = characteristicData;
    }
    async getDescriptors(descriptorUuid) {
        const descriptors = await this.shim.getDescriptors(this.device, this.serviceUuid, this.uuid, descriptorUuid);
        descriptors.forEach((descriptor) => {
            descriptor.characteristic = this;
        });
        return descriptors;
    }
    async getDescriptor(descriptorUuid) {
        const descriptor = await this.shim.getDescriptor(this.device, this.serviceUuid, this.uuid, descriptorUuid);
        descriptor.characteristic = this;
        return descriptor;
    }
    async readValue() {
        this.value = await this.shim.readCharacteristic(this.device, this.serviceUuid, this.uuid);
        return this.value;
    }
    async writeValue(value) {
        await this.writeValueWithResponse(value);
    }
    async writeValueWithResponse(value) {
        await this.shim.writeCharacteristic(this.device, this.serviceUuid, this.uuid, value, 'withResponse');
    }
    async writeValueWithoutResponse(value) {
        await this.shim.writeCharacteristic(this.device, this.serviceUuid, this.uuid, value, 'withoutResponse');
    }
    async startNotifications() {
        await this.shim.startNotifications(this.device, this.serviceUuid, this.uuid);
        return this;
    }
    async stopNotifications() {
        await this.shim.stopNotifications(this.device, this.serviceUuid, this.uuid);
        return this;
    }
    handleValueChange(value) {
        this.value = toDataView(value);
        this.dispatchShimEvent('characteristicvaluechanged', this);
    }
}
class BluetoothRemoteGATTDescriptorShim {
    constructor(shim, device, serviceUuid, characteristicUuid, descriptorData) {
        this.shim = shim;
        this.device = device;
        this.serviceUuid = serviceUuid;
        this.characteristicUuid = characteristicUuid;
        this.descriptorData = descriptorData;
        this.characteristic = null;
        this.value = null;
    }
    get uuid() {
        return this.descriptorData.uuid;
    }
    async readValue() {
        this.value = await this.shim.readDescriptor(this.device, this.serviceUuid, this.characteristicUuid, this.uuid);
        return this.value;
    }
    async writeValue(value) {
        await this.shim.writeDescriptor(this.device, this.serviceUuid, this.characteristicUuid, this.uuid, value);
    }
}
class BluetoothShimFacade extends ShimEventEmitter {
    constructor(shim) {
        super();
        this.shim = shim;
    }
    async getAvailability() {
        return this.shim.getAvailability();
    }
    async getDevices() {
        return this.shim.getDevices();
    }
    async requestDevice(options) {
        return this.shim.requestDevice(options);
    }
}
function mergeRequestedServices(filters) {
    if (!filters || filters.some((filter) => !filter.services || filter.services.length === 0)) {
        return [];
    }
    const services = new Set();
    filters.forEach((filter) => {
        var _a;
        (_a = filter.services) === null || _a === void 0 ? void 0 : _a.forEach((service) => {
            services.add(normalizeUuid(service));
        });
    });
    return Array.from(services);
}
function matchesRequestOptions(device, options) {
    var _a;
    if (options.acceptAllDevices) {
        return true;
    }
    if (!options.filters || options.filters.length === 0) {
        return false;
    }
    const advertisedServices = new Set(((_a = device.serviceUuids) !== null && _a !== void 0 ? _a : []).map((serviceUuid) => normalizeUuid(serviceUuid)));
    return options.filters.some((filter) => {
        var _a, _b;
        const hasServiceConstraint = Boolean(filter.services && filter.services.length > 0);
        const hasNameConstraint = typeof filter.name === 'string';
        const hasNamePrefixConstraint = typeof filter.namePrefix === 'string';
        if (!hasServiceConstraint && !hasNameConstraint && !hasNamePrefixConstraint) {
            return false;
        }
        if (filter.name && device.name !== filter.name) {
            return false;
        }
        if (filter.namePrefix) {
            if (!((_a = device.name) === null || _a === void 0 ? void 0 : _a.startsWith(filter.namePrefix))) {
                return false;
            }
        }
        if (!hasServiceConstraint) {
            return true;
        }
        const services = (_b = filter.services) !== null && _b !== void 0 ? _b : [];
        return services.every((service) => advertisedServices.has(normalizeUuid(service)));
    });
}
function createCharacteristicKey(deviceId, serviceUuid, characteristicUuid) {
    return `${deviceId}::${normalizeUuid(serviceUuid)}::${normalizeUuid(characteristicUuid)}`;
}
function normalizeUuid(value) {
    return canonicalUUID(value);
}
function canonicalUUID(value) {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return `${value.toString(16).padStart(8, '0')}${BLUETOOTH_BASE_UUID_SUFFIX}`;
    }
    const trimmed = String(value).trim().toLowerCase();
    if (trimmed in BLUETOOTH_SERVICE_UUID_ALIASES) {
        return `${BLUETOOTH_SERVICE_UUID_ALIASES[trimmed].toString(16).padStart(8, '0')}${BLUETOOTH_BASE_UUID_SUFFIX}`;
    }
    if (/^0x[0-9a-f]+$/iu.test(trimmed)) {
        return `${trimmed.slice(2).padStart(8, '0')}${BLUETOOTH_BASE_UUID_SUFFIX}`;
    }
    if (/^[0-9a-f]{4}$/iu.test(trimmed) || /^[0-9a-f]{8}$/iu.test(trimmed)) {
        return `${trimmed.padStart(8, '0')}${BLUETOOTH_BASE_UUID_SUFFIX}`;
    }
    if (/^[0-9a-f]{32}$/iu.test(trimmed)) {
        return trimmed.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/u, '$1-$2-$3-$4-$5');
    }
    return trimmed;
}
function toDataView(value) {
    const bytes = value instanceof Uint8Array
        ? value
        : value instanceof DataView
            ? new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength))
            : ArrayBuffer.isView(value)
                ? new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength))
                : value instanceof ArrayBuffer
                    ? new Uint8Array(value.slice(0))
                    : Uint8Array.from(value !== null && value !== void 0 ? value : []);
    return new DataView(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
}
function toUint8Array(value) {
    if (value instanceof Uint8Array) {
        return new Uint8Array(value);
    }
    if (value instanceof DataView) {
        return new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
    }
    if (ArrayBuffer.isView(value)) {
        return new Uint8Array(value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength));
    }
    if (value instanceof ArrayBuffer) {
        return new Uint8Array(value.slice(0));
    }
    return Uint8Array.from(value);
}
function createBluetoothError(name, message) {
    try {
        return new DOMException(message, name);
    }
    catch (_a) {
        const error = new Error(message);
        error.name = name;
        return error;
    }
}
function normalizeError(error) {
    if (error instanceof Error) {
        return error;
    }
    return new Error(String(error));
}
function installBluetoothLowEnergyShim(plugin, options = {}) {
    var _a, _b, _c;
    const root = ((_a = options.root) !== null && _a !== void 0 ? _a : globalThis);
    const isNativePlatform = (_b = options.isNativePlatform) !== null && _b !== void 0 ? _b : core.Capacitor.isNativePlatform();
    const isPluginAvailable = (_c = options.isPluginAvailable) !== null && _c !== void 0 ? _c : core.Capacitor.isPluginAvailable(PLUGIN_NAME);
    if (!isNativePlatform || !isPluginAvailable || !root.navigator || root.navigator.bluetooth) {
        return;
    }
    const shim = new NativeWebBluetoothShim(root, plugin);
    shim.install();
}

class BluetoothLowEnergyUtils {
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
    static convertBytesToHex(bytes) {
        return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
    }
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
    static convertHexToBytes(hex) {
        const bytes = [];
        for (let i = 0; i < hex.length; i += 2) {
            bytes.push(parseInt(hex.substr(i, 2), 16));
        }
        return bytes;
    }
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
    static convertStringToBytes(str) {
        return Array.from(new TextEncoder().encode(str));
    }
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
    static convertBytesToString(bytes) {
        return new TextDecoder().decode(new Uint8Array(bytes));
    }
}

const BluetoothLowEnergy = core.registerPlugin('BluetoothLowEnergy', {
    web: () => Promise.resolve().then(function () { return web; }).then((module) => new module.BluetoothLowEnergyWeb()),
});
BluetoothLowEnergy.shimWebBluetooth = () => {
    installBluetoothLowEnergyShim(BluetoothLowEnergy);
};

class BluetoothLowEnergyWeb extends core.WebPlugin {
    constructor() {
        super(...arguments);
        this.devices = new Map();
        this.services = new Map();
        this.characteristicListeners = new Map();
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async initialize(_options) {
        if (!navigator.bluetooth) {
            throw new Error('Web Bluetooth API is not available');
        }
    }
    shimWebBluetooth() {
        // The browser already provides navigator.bluetooth when available.
    }
    async isAvailable() {
        if (!navigator.bluetooth) {
            return { available: false };
        }
        try {
            const available = await navigator.bluetooth.getAvailability();
            return { available };
        }
        catch (_a) {
            return { available: false };
        }
    }
    async isEnabled() {
        const { available } = await this.isAvailable();
        return { enabled: available };
    }
    async isLocationEnabled() {
        // Location is not relevant for Web Bluetooth
        return { enabled: true };
    }
    async openAppSettings() {
        throw new Error('openAppSettings is not supported on web');
    }
    async openBluetoothSettings() {
        throw new Error('openBluetoothSettings is not supported on web');
    }
    async openLocationSettings() {
        throw new Error('openLocationSettings is not supported on web');
    }
    async checkPermissions() {
        // Web Bluetooth handles permissions through requestDevice
        return {
            bluetooth: 'prompt',
            location: 'granted',
        };
    }
    async requestPermissions() {
        // Web Bluetooth handles permissions through requestDevice
        return {
            bluetooth: 'granted',
            location: 'granted',
        };
    }
    async startScan(options) {
        var _a;
        if (!navigator.bluetooth) {
            throw new Error('Web Bluetooth API is not available');
        }
        const requestOptions = {};
        if ((options === null || options === void 0 ? void 0 : options.services) && options.services.length > 0) {
            requestOptions.filters = [{ services: options.services }];
        }
        else {
            requestOptions.acceptAllDevices = true;
        }
        if (options === null || options === void 0 ? void 0 : options.services) {
            requestOptions.optionalServices = options.services;
        }
        try {
            const device = await navigator.bluetooth.requestDevice(requestOptions);
            const bleDevice = {
                deviceId: device.id,
                name: (_a = device.name) !== null && _a !== void 0 ? _a : null,
            };
            this.devices.set(device.id, device);
            this.notifyListeners('deviceScanned', { device: bleDevice });
        }
        catch (error) {
            if (error instanceof Error && error.name === 'NotFoundError') {
                // User cancelled the device picker
                return;
            }
            throw error;
        }
    }
    async stopScan() {
        // Web Bluetooth doesn't have a continuous scan - it uses a picker
        // Nothing to do here
    }
    async connect(options) {
        const device = this.devices.get(options.deviceId);
        if (!device) {
            throw new Error(`Device ${options.deviceId} not found`);
        }
        if (!device.gatt) {
            throw new Error(`Device ${options.deviceId} does not support GATT`);
        }
        await device.gatt.connect();
        this.notifyListeners('deviceConnected', { deviceId: options.deviceId });
    }
    async disconnect(options) {
        var _a;
        const device = this.devices.get(options.deviceId);
        if (!device) {
            throw new Error(`Device ${options.deviceId} not found`);
        }
        if ((_a = device.gatt) === null || _a === void 0 ? void 0 : _a.connected) {
            device.gatt.disconnect();
        }
        this.notifyListeners('deviceDisconnected', { deviceId: options.deviceId });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async createBond(_options) {
        throw new Error('createBond is not supported on web');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async isBonded(_options) {
        throw new Error('isBonded is not supported on web');
    }
    async discoverServices(options) {
        var _a;
        const device = this.devices.get(options.deviceId);
        if (!((_a = device === null || device === void 0 ? void 0 : device.gatt) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw new Error(`Device ${options.deviceId} is not connected`);
        }
        const gattServices = await device.gatt.getPrimaryServices();
        const services = [];
        for (const gattService of gattServices) {
            const characteristics = await gattService.getCharacteristics();
            const bleCharacteristics = await Promise.all(characteristics.map(async (char) => {
                const descriptors = await char.getDescriptors();
                return {
                    uuid: char.uuid,
                    properties: {
                        broadcast: char.properties.broadcast,
                        read: char.properties.read,
                        writeWithoutResponse: char.properties.writeWithoutResponse,
                        write: char.properties.write,
                        notify: char.properties.notify,
                        indicate: char.properties.indicate,
                        authenticatedSignedWrites: char.properties.authenticatedSignedWrites,
                        extendedProperties: false,
                    },
                    descriptors: descriptors.map((desc) => ({ uuid: desc.uuid })),
                };
            }));
            services.push({
                uuid: gattService.uuid,
                characteristics: bleCharacteristics,
            });
        }
        this.services.set(options.deviceId, services);
    }
    async getServices(options) {
        const services = this.services.get(options.deviceId);
        if (!services) {
            return { services: [] };
        }
        return { services };
    }
    async getConnectedDevices() {
        var _a, _b;
        const devices = [];
        for (const [deviceId, device] of this.devices) {
            if ((_a = device.gatt) === null || _a === void 0 ? void 0 : _a.connected) {
                devices.push({
                    deviceId,
                    name: (_b = device.name) !== null && _b !== void 0 ? _b : null,
                });
            }
        }
        return { devices };
    }
    async readCharacteristic(options) {
        var _a;
        const device = this.devices.get(options.deviceId);
        if (!((_a = device === null || device === void 0 ? void 0 : device.gatt) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw new Error(`Device ${options.deviceId} is not connected`);
        }
        const service = await device.gatt.getPrimaryService(options.service);
        const characteristic = await service.getCharacteristic(options.characteristic);
        const dataView = await characteristic.readValue();
        const value = [];
        for (let i = 0; i < dataView.byteLength; i++) {
            value.push(dataView.getUint8(i));
        }
        return { value };
    }
    async writeCharacteristic(options) {
        var _a;
        const device = this.devices.get(options.deviceId);
        if (!((_a = device === null || device === void 0 ? void 0 : device.gatt) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw new Error(`Device ${options.deviceId} is not connected`);
        }
        const service = await device.gatt.getPrimaryService(options.service);
        const characteristic = await service.getCharacteristic(options.characteristic);
        const data = new Uint8Array(options.value);
        if (options.type === 'withoutResponse') {
            await characteristic.writeValueWithoutResponse(data);
        }
        else {
            await characteristic.writeValueWithResponse(data);
        }
    }
    async startCharacteristicNotifications(options) {
        var _a;
        const device = this.devices.get(options.deviceId);
        if (!((_a = device === null || device === void 0 ? void 0 : device.gatt) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw new Error(`Device ${options.deviceId} is not connected`);
        }
        const service = await device.gatt.getPrimaryService(options.service);
        const characteristic = await service.getCharacteristic(options.characteristic);
        const key = `${options.deviceId}-${options.service}-${options.characteristic}`;
        const listener = (event) => {
            const dataView = event.target.value;
            if (!dataView)
                return;
            const value = [];
            for (let i = 0; i < dataView.byteLength; i++) {
                value.push(dataView.getUint8(i));
            }
            this.notifyListeners('characteristicChanged', {
                deviceId: options.deviceId,
                service: options.service,
                characteristic: options.characteristic,
                value,
            });
        };
        characteristic.addEventListener('characteristicvaluechanged', listener);
        this.characteristicListeners.set(key, listener);
        await characteristic.startNotifications();
    }
    async stopCharacteristicNotifications(options) {
        var _a;
        const device = this.devices.get(options.deviceId);
        if (!((_a = device === null || device === void 0 ? void 0 : device.gatt) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw new Error(`Device ${options.deviceId} is not connected`);
        }
        const service = await device.gatt.getPrimaryService(options.service);
        const characteristic = await service.getCharacteristic(options.characteristic);
        const key = `${options.deviceId}-${options.service}-${options.characteristic}`;
        const listener = this.characteristicListeners.get(key);
        if (listener) {
            characteristic.removeEventListener('characteristicvaluechanged', listener);
            this.characteristicListeners.delete(key);
        }
        await characteristic.stopNotifications();
    }
    async readDescriptor(options) {
        var _a;
        const device = this.devices.get(options.deviceId);
        if (!((_a = device === null || device === void 0 ? void 0 : device.gatt) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw new Error(`Device ${options.deviceId} is not connected`);
        }
        const service = await device.gatt.getPrimaryService(options.service);
        const characteristic = await service.getCharacteristic(options.characteristic);
        const descriptors = await characteristic.getDescriptors();
        const descriptor = descriptors.find((d) => d.uuid === options.descriptor);
        if (!descriptor) {
            throw new Error(`Descriptor ${options.descriptor} not found`);
        }
        const dataView = await descriptor.readValue();
        const value = [];
        for (let i = 0; i < dataView.byteLength; i++) {
            value.push(dataView.getUint8(i));
        }
        return { value };
    }
    async writeDescriptor(options) {
        var _a;
        const device = this.devices.get(options.deviceId);
        if (!((_a = device === null || device === void 0 ? void 0 : device.gatt) === null || _a === void 0 ? void 0 : _a.connected)) {
            throw new Error(`Device ${options.deviceId} is not connected`);
        }
        const service = await device.gatt.getPrimaryService(options.service);
        const characteristic = await service.getCharacteristic(options.characteristic);
        const descriptors = await characteristic.getDescriptors();
        const descriptor = descriptors.find((d) => d.uuid === options.descriptor);
        if (!descriptor) {
            throw new Error(`Descriptor ${options.descriptor} not found`);
        }
        const data = new Uint8Array(options.value);
        await descriptor.writeValue(data);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async readRssi(_options) {
        throw new Error('readRssi is not supported on web');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async requestMtu(_options) {
        throw new Error('requestMtu is not supported on web');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async requestConnectionPriority(_options) {
        throw new Error('requestConnectionPriority is not supported on web');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async startAdvertising(_options) {
        throw new Error('startAdvertising is not supported on web');
    }
    async addGattService(_options) {
        throw new Error('addGattService is not supported on web');
    }
    async removeGattService(_options) {
        throw new Error('removeGattService is not supported on web');
    }
    async setGattCharacteristicValue(_options) {
        throw new Error('setGattCharacteristicValue is not supported on web');
    }
    async notifyGattCharacteristicChanged(_options) {
        throw new Error('notifyGattCharacteristicChanged is not supported on web');
    }
    async stopAdvertising() {
        throw new Error('stopAdvertising is not supported on web');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async startForegroundService(_options) {
        throw new Error('startForegroundService is not supported on web');
    }
    async stopForegroundService() {
        throw new Error('stopForegroundService is not supported on web');
    }
    async getPluginVersion() {
        return { version: 'web' };
    }
}

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BluetoothLowEnergyWeb: BluetoothLowEnergyWeb
});

exports.BluetoothLowEnergy = BluetoothLowEnergy;
exports.BluetoothLowEnergyUtils = BluetoothLowEnergyUtils;
//# sourceMappingURL=plugin.cjs.js.map
