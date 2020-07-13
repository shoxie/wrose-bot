const Bar = require('../../utils/progressBar')
module.exports = {
  config: {
    name: 'nowPlaying',
    usage: 'nowPlaying',
    aliases: ['np'],
    description: 'Send information of playing song',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id)
    if (!serverQueue) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: "I'm not playing anything right now"
        }
      })
    } else {
      try {
        const bar = new Bar(
          Math.floor((parseInt(serverQueue.dispatcher.streamTime) / 1000)),
          serverQueue.queue[0].seconds,
          20
        )
        const progress = bar.createBar()
        message.channel.send({
          embed: {
            color: 3447003,
            title: 'Now playing',
            url: serverQueue.queue[0].url,
            fields: [
              {
                name: 'Song name',
                value: serverQueue.queue[0].title
              },
              {
                name: 'Duration',
                value: serverQueue.queue[0].duration
              },
              {
                name: 'Requested by',
                value: serverQueue.queue[0].requester
              },
              {
                name: 'Current seek',
                value: msToTime() + '\n' + progress
              }
            ],
            thumbnail: {
              url: message.client.user.avatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
              })
            },
            image: {
              url: serverQueue.queue[0].thumbnail
            },
            footer: {
              text: 'Created by wrose'
            }
          }
        })
      } catch (error) {
        message.channel.send(error.message)
      }
    }
    function msToTime () {
      const duration = serverQueue.dispatcher.streamTime
      var milliseconds = parseInt((duration % 1000) / 100)
      var seconds = Math.floor((duration / 1000) % 60)
      var minutes = Math.floor((duration / (1000 * 60)) % 60)
      var hours = Math.floor((duration / (1000 * 60 * 60)) % 24)

      hours = hours < 10 ? '0' + hours : hours
      minutes = minutes < 10 ? '0' + minutes : minutes
      seconds = seconds < 10 ? '0' + seconds : seconds

      return minutes + ':' + seconds
    }
  }
}
