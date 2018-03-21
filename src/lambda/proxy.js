import * as cookie from 'cookie'
import Token from 'ringcentral-ts/Token'
import { decrypt } from '../crypto'
import getRc, { createAuthUrl } from "../rc"
import getConfig from '../config'


export async function get(event, context, callback) {
    const config = getConfig(event.requestContext.stage)

    let encryptedUrl = decodeURIComponent(event.pathParameters['encryptedUrl'])
    // 1. Decode the original RC platform url
    let rcUrl
    try {
        rcUrl = decrypt(encryptedUrl, config.urlCryptKey)
    } catch (e) {
        console.warn('Fail to decrypt url', e)
        callback(null, {
            statusCode: 400,
            body: JSON.stringify({ message: 'Fail to decode your url.', error: 'BadUrl' })
        })
        return
    }

    // 2. Check access token in cookie
    let cookies = cookie.parse(event.headers.Cookie || '')
    let encryptedToken = cookies['rc-token']
    if (!encryptedToken) {// Redirect RC oauth page
        let { brand } = event.queryStringParameters || {}
        callback(null, {
            statusCode: 302,
            headers: {
                Location: createAuthUrl({ state: encryptedUrl, brand_id: brand })
            }
        })
        return
    }
    let rc = getRc()
    rc.setToken({ access_token: decrypt(encryptedToken, config.urlCryptKey) })
    let prefixMatch = rcUrl.match(/^\/restapi\/[^\/]*(.*)$/)
    if (prefixMatch) {
        rcUrl = prefixMatch[1]
    }
    let res
    try {
        res = await rc.get(rcUrl)
    } catch (e) {
        res = e.rawRes || {}
        callback(null, {
            statusCode: res.status || 403,
            headers: {
                'Content-Type': 'text/html'
            },
            body: `Error occurs: ${e.message} 
            <p>You may try to 
                <strong><a href='${createAuthUrl({ state: encryptedUrl, brand_id: brand, force: true })}' title='Log into RingCentral'>
                login again
                </a></strong>.
            </p>`,
        })
        return
    }

    let rcHeaders = res.headers;
    let data = await res.buffer()
    callback(null, {
        statusCode: 200,
        headers: {
            'Content-Type': rcHeaders.get('content-type'),
            'Content-Disposition': rcHeaders.get('content-disposition')
        },
        body: data.toString('base64'),
        isBase64Encoded: true
    })

}

