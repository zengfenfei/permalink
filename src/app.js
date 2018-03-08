main();

function main() {
    let hash = location.hash
    if (hash.length < 2) {
        document.body.innerHTML = '<h1>No hash parameters: rc_media</h1>';
        return
    }

    let mediaLink = hash.match(/\brc_media=([^&]+)/)
    if (mediaLink) {    // Go to login page to get access token
        mediaLink = mediaLink[1]
        let callbackUrl = location.origin + location.pathname
        let loginUrl = 'https://platform.devtest.ringcentral.com/restapi/oauth/authorize?response_type=token&client_id=ZoiLYl4_RH2hDmn7op0siA&redirect_uri=' + encodeURIComponent(callbackUrl) + '&state=' + mediaLink;
        window.location = loginUrl
        return;
    }

    let accessToken = hash.match(/\baccess_token=([^&]+)/)
    if (accessToken) {
        accessToken = accessToken[1]
        let tokenParam = 'access_token=' + accessToken;
        let mediaLink = decodeURIComponent(hash.match(/\bstate=([^&]+)/)[1])
        if (mediaLink.indexOf('?') == -1) {
            mediaLink += '?' + tokenParam
        } else {
            mediaLink += '&' + tokenParam
        }
        window.location = mediaLink;
    }
}