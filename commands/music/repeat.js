let musicModel = require('../../model/model')
module.exports = {
    config: {
        name: 'repeat',
        enabled: true,
        usage: 'repeat'
    },
    async run(client, message, args) {
        musicModel.queue.unshift(musicModel.songInfo.video_url);
        message.channel.send({
            embed: {
                color: 3066993,
                title: 'Repeating one song',
                description: 'Song name ' + musicModel.songInfo.title
            }
        })
    }
}