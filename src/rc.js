import RingCentral from 'ringcentral-ts'
import config from './config'

let { rcApp } = config
let rc = new RingCentral({
    server: rcApp.server,
    appKey: rcApp.clientId,
    appSecret: rcApp.clientSecret,
    redirectUri: rcApp.redirectUri
})

export default rc

export function createAuthUrl(state, brand_id) {
    return rc.oauthUrl(rcApp.redirectUri, { state, brand_id })
}

export async function getTokenByCode(code) {
    return rc.oauth(code, rcApp.redirectUri)
}