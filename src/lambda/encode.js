import * as url from 'url'
import { encrypt } from '../crypto'
import { getStageConfig } from '../config'
import { validateBrand } from "../brand";

export function get(event, context, callback) {
    let rcUrl = decodeURIComponent(event.pathParameters['rcUrl']);
    rcUrl = url.parse(rcUrl)
    let { hostname } = rcUrl
    if (!hostname) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({ error: 'Incomplete url' })
        })
        return
    }
    let stage = 'prd'
    if (hostname.match(/\bdevtest\b/)) {
        stage = 'dev'
    }
    const config = getStageConfig(stage)
    let { brand } = event.queryStringParameters || {}
    let brandId = validateBrand(brand, config.brands)
    if (!brandId) {
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({ error: 'Bad brand:' + brand })
        })
        return
    }
    let permaLink = config.proxyBaseUrl + encrypt(rcUrl.path, config.urlCryptKey) + '?brand=' + brandId
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ permaLink, error: null, message: 'ok' })
    })
}
