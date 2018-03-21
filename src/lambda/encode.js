import * as url from 'url'
import { encrypt } from '../crypto'
import { getStageConfig } from '../config'

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
    let stage = 'prd'
    if (hostname.match(/\bdevtest\b/)) {
        stage = 'dev'
    }
    const config = getStageConfig(stage)
    let permaLink = config.proxyBaseUrl + encodeURIComponent(encrypt(rcUrl.path, config.urlCryptKey))
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ permaLink, error: null, message: 'ok' })
    })
}
