let musicModel = require('../../model/model.js')
module.exports = {
    name: 'disconnect',
    async run(message, args) {
        musicModel.queue = [];

        if (musicModel.voiceChannel) {
            musicModel.connection.dispatcher.end();
            musicModel.voiceChannel.leave();
            message.channel.send({
                embed: {
                    title: 'Disconnected from voiceChannel'
                }
            });
        }

    }
}