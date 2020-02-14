const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config/config.json");
process.env.NODE_PATH = __dirname;
require('dotenv').config()
const eventHandler = require("./handler/eventHandler.js")(client);

client.login(process.env.token);