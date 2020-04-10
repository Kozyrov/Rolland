const axios = require('axios');

module.exports = {
    // Handles messages events
    handleMessage: (sender_psid, received_message, context) => {
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
            module.exports.callSendAPI(sender_psid, payload, context);
        } catch (err) {
            context.res.status(500).send(`Unhandled exception contacting FBMessages API: ${err}`);
        }
    },

    // Handles messaging_postbacks events
    handlePostback: (sender_psid, received_postback) => {

    },

    // Sends response messages via the Send API
    callSendAPI: async (sender_psid, payload, context) => {
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
}