import { stringify } from 'querystring'
import * as fetch from 'node-fetch'
import config from '../config'

const redirect_uri = config.rcApp.redirectUri

export function createAuthUrl(state, brand_id) {
    let { rcApp } = config;
    let loginUrl = rcApp.server + '/restapi/oauth/authorize?' + stringify({
        response_type: 'code',
        redirect_uri,
        client_id: rcApp.clientId,
        state,
        brand_id
    })
    return loginUrl
}

export async function getTokenByCode(code) {
    let { rcApp } = config;
    let res = await fetch(rcApp.server + '/restapi/oauth/token', {
        method: 'POST',
        body: {
            grant_type: 'authorization_code',
            code,
            redirect_uri
        }
    })
    return await res.json()
}