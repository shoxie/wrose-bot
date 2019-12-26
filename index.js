const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config/config.json");
process.env.NODE_PATH = __dirname;

const eventHandler = require("./handler/eventHandler.js")(client);
var database = require('./model/db.js');

client.login(config.token);