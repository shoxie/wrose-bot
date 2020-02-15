let musicModel = require('../../model/model')
module.exports = {
    config: {
        name: 'summon',
        usage: 'summon the bot to your channel',
        enabled: null,
    },
    async run(message, args) {
        if (musicModel.isPlaying === true) {
            return message.channel.send({
                embed: {
                    color: 15158332,
                    title: 'I\'m playing at another channel, please wait till i finished all the command.',
                }
            })
        }
        if ((musicModel.isPlaying === false) && (!musicModel.voiceChannel)) {
            musicModel.voiceChannel = message.member.voiceChannel;
            musicModel.connection = await message.member.voiceChannel.join();
        }

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