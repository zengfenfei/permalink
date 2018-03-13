import * as https from 'https'
import { decrypt } from '../crypto'
import config from '../config'
import { stringify } from "querystring";

export function get(event, context, callback) {
    let cryptKey = process.env['urlCryptKey']
    let encryptedUrl = decodeURIComponent(event.pathParameters['encryptedUrl'])

    // 1. Decode the original RC platform url
    let rcUrl;
    try {
        rcUrl = decrypt(encryptedUrl, cryptKey)
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

function createAuthUrl(state, brand_id) {
    let { rcApp } = config;
    let loginUrl = rcApp.server + '/restapi/oauth/authorize?' + stringify({
        response_type: 'code',
        redirect_uri: 'https://510e0sej78.execute-api.us-east-1.amazonaws.com/dev/rc-oauth/callback/',
        client_id: rcApp.clientId,
        state,
        brand_id
    })
    return loginUrl
}