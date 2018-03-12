import * as crypto from 'crypto'

export function get(event, context, callback) {
    let cryptKey = Buffer.from(process.env['urlCryptKey'])
    let rcUrl = decodeURIComponent(event.pathParameters['rcUrl']);
    let cipher = crypto.createCipher('AES-256-ECB', cryptKey)
    let encrypted = cipher.update(Buffer.from(rcUrl))
    encrypted = Buffer.concat([encrypted, cipher.final()])
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ permaLink: encrypted.toString('base64'), error: null, message: 'ok' })
    })
}
