const axios = require('axios');

module.exports = {
    // Handles Message events
    handleMessage: async (sender_psid, received_message) => {
        let response;
    
        // Check if the message contains text
        if (received_message.text) {    
    
            // Create the payload for a basic text message
            response = {
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
        await module.exports.callSendAPI(sender_psid, response);
        
    },
    
    // Handles messaging_postbacks events
    handlePostback: (sender_psid, received_postback) => {
        let response;
  
        // Get the payload for the postback
        let payload = received_postback.payload;

        // Set the response based on the postback payload
        if (payload === 'yes') {
            response = { "text": "Thanks!" }
        } else if (payload === 'no') {
            response = { "text": "Oops, try sending another image." }
        }
        // Send the message to acknowledge the postback
        await module.exports.callSendAPI(sender_psid, response);
    },
    
    // Sends response messages via the Send API
    callSendAPI: async (sender_psid, response) => {
        // Construct the message body
        let request_body = {
            "recipient": {
                "id": sender_psid
            },
            "message": response
        }
    
        try {
            await axios({
                "method": "post",
                "url": "https://graph.facebook.com/v2.6/me/messages",
                "params": { "access_token": process.env.PAGE_ACCESS_TOKEN },
                "data": request_body
            }).then((res) => {
                console.log(`message sent!: ${res}`);
            });
        } catch (err) {
            console.error(`Unable to send message: ${err}`); 
        }
    }
};
