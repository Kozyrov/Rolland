module.exports = function (context) {
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
            log(`POST fnc - Sender PSID:  ${sender_psid}`);

            // Check if the event is a message or postback and
            // pass the event to the appropriate handler function
            if (webhook_event.message) {
                handleMessage(sender_psid, webhook_event.message, context);        
            } else if (webhook_event.postback) {
                handlePostback(sender_psid, webhook_event.postback, context);
            }
        });
            
        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.status(404).send();
    }
}

handleMessage = (sender_psid, received_message, context) => {
    let payload;

    // Check if the message contains text
    if (received_message.text) {    

        // Create the payload for a basic text message
        payload = {
        "text": `You sent the message: "${received_message.text}". Now send me an image!`
        }
    }  

    // Sends the response message
    try {
        callSendAPI(sender_psid, payload, context);
    } catch (err) {
        context.res.status(500).send(`Unhandled exception contacting FBMessages API: ${err}`);
    }
},

// Handles messaging_postbacks events
handlePostback = (sender_psid, received_postback) => {

},

// Sends response messages via the Send API
callSendAPI = async (sender_psid, payload, context) => {
    // Construct the message body
    let request_body = {
        "recipient": {
            "id": sender_psid
        },
        "message": payload
    }

    try {
        await axios({
            "method": "post",
            "url": "https://graph.facebook.com/v2.6/me/messages",
            "params": { access_token: process.env.PAGE_ACCESS_TOKEN },
            "data": request_body
        }).then((res) => {
            context.log(`message sent!: ${res}`);
        });
    } catch (err) {
        context.error(`Unable to send message: ${err}`); 
    }
}