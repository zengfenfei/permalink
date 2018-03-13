import { encrypt } from '../crypto'

export function get(event, context, callback) {
    let rcUrl = decodeURIComponent(event.pathParameters['rcUrl']);
    let encoded = encrypt(rcUrl)
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ encoded, error: null, message: 'ok' })
    })
}
