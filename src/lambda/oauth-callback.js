import * as cookie from 'cookie'
import { encrypt } from "../crypto";
import { getTokenByCode } from "../rc";
import getConfig from '../config'

export async function get(event, context, callback) {
    const config = getConfig(event.requestContext.stage)

    let { queryStringParameters } = event
    if (!queryStringParameters) {
        callback(null, {
            statusCode: 400,
            body: 'Empty query parameters'
        })
        return
    }
    let { code, state, error, error_description } = queryStringParameters
    if (!code || !state) {
        callback(null, {
            statusCode: 403,
            body: `Login failed. Error: ${error}, ${error_description}. You can login again and authorize this app.`
        })
        return
    }
    let token
    try {
        token = await getTokenByCode(code)
    } catch (e) {
        callback(null, {
            statusCode: 403,
            body: "Please check your RC credentials. " + e
        })
        return
    }

    callback(null, {
        statusCode: 302,
        headers: {
            'Set-Cookie': cookie.serialize(
                'rc-token',
                encrypt(token.accessToken, config.urlCryptKey),
                { path: '/', expires: new Date(token.expiresIn), httpOnly: true }
            ),
            Location: config.proxyBaseUrl + state
        }
    })

}