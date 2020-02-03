let musicModel = require('../../model/model')
module.exports = {
    name: 'skip',
    async run(message, args) {

        // if (message.author.voiceChannel.id != musicModel.voiceChannel.id) { // undefined
        //     message.channel.send({
        //         embed: {
        //             title: 'You have to be in the same channel with the me to use the command'
        //         }
        //     })
        // }
        if (!musicModel.queue[0]) {
            message.channel.send({
                embed: {
                    title: 'No songs in the queue'
                }
            })
        }
        musicModel.connection.dispatcher.end();
    }
}