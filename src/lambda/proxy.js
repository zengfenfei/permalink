import * as cookie from 'cookie'
import Token from 'ringcentral-ts/Token'
import { decrypt } from '../crypto'
import rc, { createAuthUrl } from "../rc"


export async function get(event, context, callback) {
    let encryptedUrl = decodeURIComponent(event.pathParameters['encryptedUrl'])

    // 1. Decode the original RC platform url
    let rcUrl
    try {
        rcUrl = decrypt(encryptedUrl)
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
                Location: createAuthUrl(encryptedUrl, brand)
            }
        })
        return
    }
    let prefixMatch = rcUrl.match(/^\/restapi\/[^\/]*(.*)$/)
    if (prefixMatch) {
        rcUrl = prefixMatch[1]
    }
    let token = new Token();
    token.accessToken = decrypt(encryptedToken)
    token.type = 'bearer'
    token.appKey = rc.appKey
    rc.tokenStore.save(token)   // FIXME Improve TS
    let res = await rc.get(rcUrl)
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

