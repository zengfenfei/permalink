import * as crypto from 'crypto'

const algoritm = 'AES-256-ECB'
const encryptionEncoding = 'base64'

/**
 * 
 * @param {string} encrypted base64 encoded
 * @param {string} key
 */
export function decrypt(encrypted, key) {
    let decipher = crypto.createDecipher(algoritm, Buffer.from(key))
    let raw = decipher.update(Buffer.from(encrypted, encryptionEncoding))
    return Buffer.concat([raw, decipher.final()]).toString()
}

/**
 * 
 * @param {string} raw 
 * @param {string} key 
 * @returns base64 encoded data
 */
export function encrypt(raw, key) {
    let cipher = crypto.createCipher(algoritm, Buffer.from(key))
    let encrypted = cipher.update(Buffer.from(raw))
    return Buffer.concat([encrypted, cipher.final()]).toString(encryptionEncoding)
}