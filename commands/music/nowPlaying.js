let musicModel = require('../../model/model')
module.exports = {
    config: {
        name: 'nowPlaying',
        usage: 'Send information of playing song',
        enabled: true,
    },
    async run(message, args) {
        console.log(`hi`)
        message.channel.send({
            embed: {
                color: 3447003,
                title: 'Now playing',
                url: musicModel.queue[0].url,
                fields: [{
                        name: 'Song name',
                        value: musicModel.queue[0].title,

                    },
                    {
                        name: 'Duration',
                        value: musicModel.queue[0].duration
                    },
                    {
                        name: 'Requested by',
                        value: musicModel.queue[0].requester
                    }
                ],
                thumbnail: {
                    url: message.client.user.avatarURL
                },
                image: {
                    url: musicModel.queue[0].thumbnail
                },
                footer: {
                    text: 'Created by wrose'
                }
            }
        })


        if (args[0] === '--help') {
            return sendHelp(this.config);
        }

        function sendHelp(config) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: `Description of ` + config.name,
                    description: config.usage,
                    thumbnail: {
                        url: message.client.user.avatarURL
                    },
                    footer: {
                        text: 'Created by wrose'
                    }
                }
            })
        }
    }
}