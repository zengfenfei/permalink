import { encrypt } from '../crypto'

export function get(event, context, callback) {
    let cryptKey = process.env['urlCryptKey']
    let rcUrl = decodeURIComponent(event.pathParameters['rcUrl']);
    let encoded = encrypt(rcUrl, cryptKey)
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ encoded, error: null, message: 'ok' })
    })
}
