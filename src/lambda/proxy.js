import * as https from 'https'

export function get(event, context, callback) {
    console.log('>>event', JSON.stringify(event));
    console.log('>>context', JSON.stringify(context))
    console.log('Before callback')
    https.get('https://www.google.com.hk/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png', (res) => {
        let imgData = Buffer.alloc(0);
        res.on('data', buf => {
            imgData = Buffer.concat([imgData, buf])
        });
        res.on('end', () => {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Content-Type': 'image/png',
                    version: 9
                },
                body: imgData.toString('base64'), // base64
                isBase64Encoded: true
            });
            console.log('After callback5', imgData.length);
        });

    });


}