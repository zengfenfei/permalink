
export function get(event, context, callback) {
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({
            event,
            context
        })
    })
}