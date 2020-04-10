const incoming = require('../services/incoming');

module.exports = (context) => {
    const {
        req,
        res,
        log
    } = context;

    if (req.method === 'GET') {
        try {
            // Your verify token. Should be a random string.
            let ACCESS_TOKEN = process.env.ACCESS_TOKEN;
    
            // Parse the query params
            let mode = req.query['hub.mode'];
            let token = req.query['hub.verify_token'];
            let challenge = req.query['hub.challenge'];
            
            // Checks if a token and mode is in the query string of the request
            if (mode && token) {
            
                // Checks the mode and token sent is correct
                if (mode === 'subscribe' && token === ACCESS_TOKEN) {
                    
                    // Responds with the challenge token from the request
                    log('WEBHOOK_VERIFIED');
                    res.status(200).send(challenge);
                } else {
                    // Responds with '403 Forbidden' if verify tokens do not match
                    res.status(403).send();      
                }
            }
        } catch (err) {
            res.status(500).send(err);
        }
    } else if (req.method === 'POST') {
        let body = req.body;

        // Checks this is an event from a page subscription
        if (body.object === 'page') {

            // Iterates over each entry - there may be multiple if batched
            body.entry.forEach(async (entry) => {

                // Array will only ever contain one message.
                let webhook_event = entry.messaging[0];

                // Get the sender PSID
                let sender_psid = webhook_event.sender.id;
                log(`POST fnc - Sender PSID:  ${sender_psid}`);

                // Check if the event is a message or postback and
                // pass the event to the appropriate handler function
                if (webhook_event.message) {
                    await incoming.handleMessage(sender_psid, webhook_event.message, context);        
                } else if (webhook_event.postback) {
                    await incoming.handlePostback(sender_psid, webhook_event.postback, context);
                }
            });
        } else {
            res.status(404).send();
        }
    } else {
        res.status(400).send('This endpoint cannot handle your request.');
    }
}