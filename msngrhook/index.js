'use strict';

const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json());

app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));


app.post('/webhook', (req, res) => {  
 
    let body = req.body;

    // Checks this is an event from a page subscription
    if (body.object === 'page') {

        // Iterates over each entry - there may be multiple if batched
        body.entry.forEach(function(entry) {

        // Array will only ever contain one message.
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
        });

        res.status(200).send('EVENT_RECEIVED');
    } else {
        res.sendStatus(404);
    }
});

app.get('/webhook', (req, res) => {

    // Your verify token. Should be a random string.
    let TRUNK_TOKEN = process.env.TRUNK_TOKEN;

    // Parse the query params
    let mode = req.query['hub.mode'];
    let token = req.query['hub.verify_token'];
    let challenge = req.query['hub.challenge'];
      
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
    
        // Checks the mode and token sent is correct
        if (mode === 'subscribe' && token === TRUNK_TOKEN) {
            
            // Responds with the challenge token from the request
            console.log('WEBHOOK_VERIFIED');
            res.status(200).send(challenge);
        
        } else {
            // Responds with '403 Forbidden' if verify tokens do not match
            res.sendStatus(403);      
        }
    }
});