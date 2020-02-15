let fs = require("fs");
let noob = require("../music/playlist");
let conf = require('../../config/config.json')
module.exports = {
    config: {
        name: "help",
        usage: "help [command name]",
        enabled: true
    },
    async run(client, message, args) {
        if (!args[0]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: 'This is the property of wrose',
                    description: 'Honestly it\'s a bot made by wrose',
                    fields: [{
                            name: 'Prefix',
                            value: conf.prefix
                        },
                        {
                            name: 'Running in ',
                            value: client.guilds.size + ' servers'
                        }
                    ],
                    thumbnail: {
                        url: client.user.avatarURL
                    }
                }
            })
        }
        if (args[0]) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    fields: [{
                        name: 'Name',
                        value: client.commands.get(args[0]).config.name
                    }, {
                        name: 'Usage',
                        value: client.commands.get(args[0]).config.usage
                    }],
                    thumbnail: {
                        url: message.client.user.avatarURL
                    }
                }
            })
        }
    }
};