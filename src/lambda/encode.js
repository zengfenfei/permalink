import * as url from 'url'
import { encrypt } from '../crypto'
import config, { setStage } from '../config'

export function get(event, context, callback) {
    let rcUrl = decodeURIComponent(event.pathParameters['rcUrl']);
    rcUrl = url.parse(rcUrl)
    let { hostname } = rcUrl
    if (!hostname) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({ error: 'Bad url' })
        })
        return
    }
    if (hostname.match(/\bdevtest\b/)) {
        setStage('dev')

    }
    let permaLink = config.proxyBaseUrl + encodeURIComponent(encrypt(rcUrl.path))
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ permaLink, error: null, message: 'ok' })
    })
}
