const { redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'unpause',
    usage: 'unpause',
    aliases: [],
    description: 'Unpause current song queue',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id)
    if (!serverQueue) redMessage(message, 'Not playing')
    message.react('👍')
    serverQueue.dispatcher.resume()
  }
}
