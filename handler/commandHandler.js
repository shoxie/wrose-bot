const fs = require("fs");
const config = require("../config/config.json");
const Discord = require('discord.js')
module.exports = async (client, message) => {
    client.commands = new Discord.Collection();
    client.aliases = new Discord.Collection();
    client.categories = fs.readdirSync("./commands/");

    fs.readdirSync("./commands/").forEach(dir => {
        const command = fs.readdirSync(`./commands/${dir}/`).filter(file => {
            file.endsWith(".js");
            var filename = file.split('.').slice(0, -1).join('.')
            let cmdObj = require("../commands/" + dir + '/' + filename);
            client.commands.set(filename.toLowerCase(), cmdObj)
        });
    });
};