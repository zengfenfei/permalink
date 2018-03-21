import * as cookie from 'cookie'
import { encrypt } from "../crypto";
import { getTokenByCode } from "../rc";
import config, { setStage } from '../config'
import { stat } from 'fs';

export async function get(event, context, callback) {
    setStage(event.requestContext.stage)

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
    state = state.replace(/\s/g, '+')   // FIXME, a bug of oauth, the '+' in 'state' will become space when they're passed back
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
                encrypt(token.accessToken),
                { path: '/', expires: new Date(token.expiresIn), httpOnly: true }
            ),
            Location: config.proxyBaseUrl + encodeURIComponent(state)
        }
    })

}