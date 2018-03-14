import * as cookie from 'cookie'
import { encrypt } from "../crypto";
import { getTokenByCode } from "../rc";
import config from '../config'

export async function get(event, context, callback) {
    let { queryStringParameters } = event
    if (!queryStringParameters) {
        callback(null, {
            statusCode: 400,
            body: 'Empty query parameters'
        })
        return
    }
    let { code, state, error, error_description } = queryStringParameters
    if (code && state) {
        state = state.replace(/\s/g, '+')   // FIXME, a bug of oauth, the '+' in 'state' will become space when they're passed back
        let token = await getTokenByCode(code)
        callback(null, {
            statusCode: 302,
            headers: {
                'Set-Cookie': cookie.serialize(
                    'rc-token',
                    encrypt(token.accessToken),
                    { path: '/', expires: new Date(token.expiresIn), httpOnly: true }
                ),
                Location: config.rcProxyEndpoint + encodeURIComponent(state)
            }
        })
    } else {
        callback(null, {
            statusCode: 403,
            body: `Login failed. Error: ${error}, ${error_description}. You can login again and authorize this app.`
        })
    }

}