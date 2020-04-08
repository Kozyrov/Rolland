module.exports = (context) => {
    const {
        req,
        res,
        log
    } = context;

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
}