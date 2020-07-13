const { redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'setUsername',
    usage: 'setUsername',
    aliases: [],
    description: 'Set bot username',
    ownerOnly: true,
    enabled: true
  },
  async run (client, message, args) {
    if (message.deletable) {
      message.delete()
    }
    const nick = args.join(' ')
    if (!nick) {
      return redMessage(message, 'Please input some text to set as the username!')
    }

    await (client.user.setUsername(nick))
    return message.channel.send(`Successfully change username to ${nick}`).then((m) => m.delete({ timeout: 5000 }))
  }
}
