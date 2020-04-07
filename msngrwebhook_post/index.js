module.exports = async function (context) {
    const {
        req,
        res,
        log
    } = context;

    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

        // Array will only ever contain one message.
        let webhook_event = entry.messaging[0];
        log(webhook_event);
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.status(404).send();
    }
}