let musicModel = require('../../model/model')
module.exports = {
    config: {
        name: 'summon',
        usage: 'summon the bot to your channel',
        enabled: null,
    },
    async run(client, message, args) {
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
    }
}