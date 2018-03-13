import * as https from 'https'
import { decrypt } from '../crypto'

export function get(event, context, callback) {
    let cryptKey = process.env['urlCryptKey']
    let encryptedUrl = decodeURIComponent(event.pathParameters['encryptedUrl'])

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


    let encryptedToken = '';

    // 1. Check access token in cookie
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ rcUrl, event, context })
    })

}
