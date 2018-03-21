import RingCentral from 'ringcentral-ts'
import getConfig from './config'


let rc;

function getRc() {
    if (rc) {
        return rc
    }
    let { rcApp } = getConfig()
    rc = new RingCentral({
        server: rcApp.server,
        appKey: rcApp.clientId,
        appSecret: rcApp.clientSecret,
        redirectUri: rcApp.redirectUri
    })
    return rc
}


export default getRc

export function createAuthUrl(opts) {
    let { rcApp } = getConfig()
    let rc = getRc()
    return rc.oauthUrl(rcApp.redirectUri, opts)
}

export async function getTokenByCode(code) {
    let { rcApp } = getConfig()
    let rc = getRc()
    return rc.oauth(code, rcApp.redirectUri)
}