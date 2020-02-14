let fs = require("fs");
let noob = require("../music/playlist");
module.exports = {
    config: {
        name: "help",
        usage: "help [command name]"
    },
    async run(message, args) {
        message.channel.send({
            embed: {
                color: 3447003,
                title: 'Find help for commands',
                description: '[command name] --help',
                thumbnail: {
                    url: message.client.user.avatarURL
                }
            }
        })
    }
};