const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const guildSettingsAdapter = new FileSync("./data/guildSettings.json");
const guildSettings = low(guildSettingsAdapter);
const Discord = require('discord.js')
module.exports = {
    config: {
        name: 'Commands',
        usage: 'Show available commands',
        enabled: true,
    },
    async run(client, message, args) {
        let embed = new Discord.RichEmbed()
            .setColor("#0390fc")
            .setTitle("Top requested song my storage")
            .setThumbnail(client.user.avatarURL)
            .setFooter('Created by wrose')
        client.commands.forEach(command => {
            embed.addField(command.config.name, command.config.usage);
        });
        message.channel.send(embed);
    }
}