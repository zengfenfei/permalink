import * as crypto from 'crypto'
import config from './config'

const algoritm = 'AES-256-ECB'
const encryptionEncoding = 'base64'
const key = Buffer.from(config.urlCryptKey)

/**
 * 
 * @param {string} encrypted base64 encoded
 */
export function decrypt(encrypted) {
    let decipher = crypto.createDecipher(algoritm, key)
    let raw = decipher.update(Buffer.from(encrypted, encryptionEncoding))
    return Buffer.concat([raw, decipher.final()]).toString()
}

/**
 * 
 * @param {string} raw 
 * @returns base64 encoded data
 */
export function encrypt(raw) {
    let cipher = crypto.createCipher(algoritm, key)
    let encrypted = cipher.update(Buffer.from(raw))
    return Buffer.concat([encrypted, cipher.final()]).toString(encryptionEncoding)
}