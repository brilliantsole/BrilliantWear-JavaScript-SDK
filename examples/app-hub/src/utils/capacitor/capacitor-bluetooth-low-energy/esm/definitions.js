export class BluetoothLowEnergyUtils {
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
//# sourceMappingURL=definitions.js.map