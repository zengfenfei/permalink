# RingCentral Permanent Link

Convert the RingCentral platform resource(media like call recording and messages) URLs to distributable ones which will ask for authorization(OAuth) automatically.

## Quick Start

At first, encode the resource URL path part by calling `https://510e0sej78.execute-api.us-east-1.amazonaws.com/dev/encode/{urlPath}`. For example, the resource url is `https://media.devtest.ringcentral.com/restapi/v1.0/account/xx/extension/xx/message-store/xx/content/xx`, then call `https://510e0sej78.execute-api.us-east-1.amazonaws.com/dev/encode/%2Frestapi%2Fv1.0%2Faccount%2Fxx%2Fextension%2Fxx%2Fmessage-store%2Fxx%2Fcontent%2Fxx` to get encoded URL. Now you can distribute the encoded URL returned.

## Branding

Branding is supported by `brand` query paramter in the permanent link like  `https://510e0sej78.execute-api.us-east-1.amazonaws.com/dev/proxy/xxx?brand={brandId}`