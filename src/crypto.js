import * as crypto from 'crypto'

const algoritm = 'AES-256-ECB'
const encryptionEncoding = 'base64'

/**
 * 
 * @param {string} encrypted base64 encoded
 */
export function decrypt(encrypted, key) {
    encrypted = URI2base64(encrypted)
    let decipher = crypto.createDecipher(algoritm, Buffer.from(key))
    let raw = decipher.update(Buffer.from(encrypted, encryptionEncoding))
    return Buffer.concat([raw, decipher.final()]).toString()
}

/**
 * 
 * @param {string} raw 
 * @returns base64 encoded data
 */
export function encrypt(raw, key) {
    let cipher = crypto.createCipher(algoritm, Buffer.from(key))
    let encrypted = cipher.update(Buffer.from(raw))
    let base64 = Buffer.concat([encrypted, cipher.final()]).toString(encryptionEncoding)
    return base642URI(base64)
}

export function privateDecrypt(data, key) {
    data = URI2base64(data)
    return crypto.privateDecrypt(key, Buffer.from(data, encryptionEncoding)).toString()
}

/**
 * Convert stardard base64 encoded string to uri friendly string
 * @param {string} base64 
 */
export function base642URI(base64) {
    base64 = base64.replace(/\+/g, '*')
    base64 = base64.replace(/\//g, '!')
    base64 = base64.replace(/\=/g, '-')
    return base64
}

/**
 * Convert URI friendly string to standard base64
 * @param {stirng} uri 
 */
export function URI2base64(uri) {
    uri = uri.replace(/\*/g, '+')
    uri = uri.replace(/!/g, '/')
    uri = uri.replace(/-/g, '=')
    return uri
}