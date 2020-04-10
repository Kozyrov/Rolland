const axios = require('axios');

module.exports = {
    // Handles Message events
    handleMessage: async (sender_psid, received_message, context) => {
        let payload;
    
        // Check if the message contains text
        if (received_message.text) {    
    
            // Create the payload for a basic text message
            payload = {
            "text": `You sent the message: "${received_message.text}". Now send me an image!`
            }
        } else if (received_message.attachments) {
            let attachment_url = received_message.attachments[0].payload.url;

            response = {
                "attachment": {
                    "type": "template",
                    "payload": {
                        "template_type": "generic",
                        "elements": [{
                            "title": "Is this the right picture?",
                            "subtitle": "Tap a button to answer.",
                            "image_url": attachment_url,
                            "buttons": [
                                {
                                    "type": "postback",
                                    "title": "Yes!",
                                    "payload": "yes",
                                },
                                {
                                    "type": "postback",
                                    "title": "No!",
                                    "payload": "no",
                                }
                            ],
                        }]
                    }
                }
            }
        }  
    
        // Sends the response message
        await module.exports.callSendAPI(sender_psid, payload, context);
        
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
                "params": { "access_token": process.env.PAGE_ACCESS_TOKEN },
                "data": request_body
            }).then((res) => {
                context.log(`message sent!: ${res}`);
            });
        } catch (err) {
            context.log(`Unable to send message: ${err}`); 
        }
    }
};
