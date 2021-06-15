const Discord = require("discord.js");
const config = require("../config.json");
const { dice, hvDice } = require('../entities');

const client = new Discord.Client();
const prefix = "+";
const dicePrefix = "d";

client.on("message", (message) => {
    const commandBody = message.content.slice(prefix.length);
    const args = commandBody.split(' ');
    const command = args.shift().toLowerCase();

    switch(true) {
        case message.author.bot:
            break;
        case !message.content.startsWith(prefix):
            break;
        case command === "ping":
            const timeTaken = Date.now();
            message.reply(`Pong! this message had a latency of ${timeTaken}ms.`);
            break;
        case command === "roll":
            const diceArgs = args.filter( x => x.startsWith(dicePrefix));
            const diceArr = Object.values(dice).filter((die) => diceArgs.includes(die.keyname));

            const results = diceArr.map((die) => ` ${die.keyname} => ${Math.floor(Math.random() * die.value) + 1}`);

            message.reply(`rolling ... ${results.join(',')}`);
            break;
        case command === "hv-roll":
            const hvDiceArgs = args.filter( x => x.startsWith(dicePrefix));
            const hvDiceArr = hvDiceArgs.map( x => hvDice[x]);

            const hvResults = hvDiceArr.map((die) => ` ${die.keyname} => ${die.faces[Math.floor(Math.random() * die.value)]}`);
            
            message.reply(`rolling high variance... ${hvResults.join(',')}`);
            break;
        default:
            message.reply(`I don't think that's right.`);
            break;
    }    
});

client.login(config.BOT_TOKEN);
