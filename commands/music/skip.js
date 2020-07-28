const { emptyQueue } = require('../../utils/message')
const { isDJ } = require('../../utils/utility')
module.exports = {
  config: {
    name: 'skip',
    usage: 'skip',
    description: 'Skip a playing song.',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id)
    if (!serverQueue) return emptyQueue(message)
    if (serverQueue.radio) return message.reply('Playing radio stream')
    if (isDJ(message)) {
      if (message.member.voice.channel != serverQueue.voiceChannel) {
        // undefined
        return message.channel.send({
          embed: {
            title:
              'You have to be in the same channel with the me to use the command',
            author: {
              name: message.client.user.username,
              icon_url: message.client.user.avatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
              })
            }
          }
        })
      } else serverQueue.connection.dispatcher.end()
    } else return
  }
}
