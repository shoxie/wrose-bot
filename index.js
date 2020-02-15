const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config/config.json");
process.env.NODE_PATH = __dirname;
require('dotenv').config()
const eventHandler = require("./handler/eventHandler.js")(client);
const commandHandler = require('./handler/commandHandler.js')(client);
client.login(process.env.token);
client.on('ready', () => {
    client.user.setPresence({
        game: {
            name: 'with depression'
        },
        status: 'online'
    });
})