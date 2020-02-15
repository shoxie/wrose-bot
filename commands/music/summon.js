let musicModel = require('../../model/model')
module.exports = {
    config: {
        name: 'summon',
        usage: 'summon the bot to your channel',
        enabled: true,
    },
    async run(client, message, args) {
        if (!message.member.voiceChannel) {
            return message.channel.send({
                embed: {
                    color: 15158332,
                    title: '__***N I G G E R***__ join a voice channel first',
                }
            })
        }
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