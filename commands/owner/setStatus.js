const { redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'setStatus',
    usage: 'setStatus',
    aliases: [],
    description: 'Set bot status',
    ownerOnly: true,
    enabled: true
  },
  async run (client, message, args) {
    if (message.deletable) {
      message.delete()
    }

    const status = args[0]

    if (!status) {
      return redMessage(
        message,
        'Please input one of the following: `online`, `idle`, `dnd` or `invisible` and try again.'
      )
    }

    const statusType = args[0].toLowerCase()

    if (
      statusType === 'online' ||
      statusType === 'idle' ||
      statusType === 'dnd' ||
      statusType === 'invisible'
    ) {
      client.user.setStatus(status)
      message.channel
        .send(
          `Status successfully changed to **${statusType}**.\nPlease note that initially changing status may take up to a minute or two.`
        )
        .then((m) => m.delete({ timeout: 10000 }))
    } else {
      return redMessage(message, `"${statusType}" is not a valid status type.`)
    }
  }
}
