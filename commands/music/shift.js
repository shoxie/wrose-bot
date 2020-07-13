const { redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'shift',
    usage: 'shift',
    aliases: ['remove'],
    description: '',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id)
    if (!serverQueue) { return redMessage(message, "I'm not playing anothing right now") }
    const choice = args[0]
    if (!choice) return redMessage(message, 'Please give me index of the song')
    if (choice == '1') { return redMessage(message, 'Can\t remove first song of the queue') }
    const songArr = serverQueue.queue
    await songArr.splice(choice - 1, 1)
    try {
    } catch (error) {
      redMessage(message, error.title, error.message)
    }
  }
}
