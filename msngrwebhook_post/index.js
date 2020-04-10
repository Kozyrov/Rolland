const
  incoming = require('../services/incoming');

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

            // Get the sender PSID
            let sender_psid = webhook_event.sender.id;
            log(`POST fnc - Sender PSID:  ${sender_psid}, webhook event: ${webhook_event}`);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                await incoming.handleMessage(sender_psid, webhook_event.message, context);        
            } else if (webhook_event.postback) {
                await incoming.handlePostback(sender_psid, webhook_event.postback, context);
            }
        });
            
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.status(404).send();
    }
}