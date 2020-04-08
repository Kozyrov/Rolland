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
                incoming.handleMessage(sender_psid, webhook_event.message);        
            } else if (webhook_event.postback) {
                incoming.handlePostback(sender_psid, webhook_event.postback);
            }
            });
            
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.status(404).send();
    }
}