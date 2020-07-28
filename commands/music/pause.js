const { redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: '',
    usage: '',
    aliases: [],
    description: '',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id)
    if (!serverQueue) redMessage(message, 'Not playing')
    message.react(':ok_hand:')
    serverQueue.dispatcher.pause()
  }
}
