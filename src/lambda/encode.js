import { encrypt } from '../crypto'
import config from '../config'

export function get(event, context, callback) {
    let rcUrl = decodeURIComponent(event.pathParameters['rcUrl']);
    let permaLink = config.proxyBaseUrl + encodeURIComponent(encrypt(rcUrl))

    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ permaLink, error: null, message: 'ok' })
    })
}
