import * as https from 'https'
import { decrypt } from '../crypto'
import { createAuthUrl } from "../oauth";

export function get(event, context, callback) {
    let encryptedUrl = decodeURIComponent(event.pathParameters['encryptedUrl'])

    // 1. Decode the original RC platform url
    let rcUrl;
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
    let encryptedToken = '';

    // Redirect RC oauth page
    if (!encryptedToken) {
        let { brand } = event.queryStringParameters || {};
        callback(null, {
            statusCode: 302,
            headers: {
                Location: createAuthUrl(encryptedUrl, brand)
            }
        })
    }

}

