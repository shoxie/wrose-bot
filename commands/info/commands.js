const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const guildSettingsAdapter = new FileSync("./data/guildSettings.json");
const guildSettings = low(guildSettingsAdapter);
const Discord = require('discord.js');
const conf = require('../../config/config.json')
module.exports = {
    config: {
        name: 'Commands',
        usage: 'commands',
        description: 'Show available commands',
        enabled: true,
    },
    async run(client, message, args) {
        let embed = new Discord.RichEmbed()
            .setColor("#0390fc")
            .setTitle("Commands that i can execute")
            .setThumbnail(client.user.avatarURL)
            .setFooter('Created by wrose')
        client.commands.forEach(command => {
            let status = command.config.enabled ? 'enabled' : 'disabled'
            let value = `${conf.prefix}${command.config.usage}` + ' ' + `__***[${status}]***__`
            embed.addField(command.config.name, value);
        });
        message.channel.send(embed);
    }
}