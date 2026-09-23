import { WebPlugin } from '@capacitor/core';
export class BluetoothLowEnergyWeb extends WebPlugin {
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
//# sourceMappingURL=web.js.map