const request = require('node-superfetch')

module.exports = {
  config: {
    name: 'qrCode',
    usage: 'qrCode',
    aliases: [],
    description: 'Create qrCode for custom text',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    message.channel.send('What text you wanna create ?')
    const collected = await message.channel.awaitMessages(
      m => m.author.id === message.author.id,
      {
        max: 1,
        time: 30000
      }
    )
    const text = collected.first().content
    try {
      const { body } = await request
        .get('https://api.qrserver.com/v1/create-qr-code/')
        .query({ data: text })
      return message.channel.send({ files: [{ attachment: body, name: 'qr-code.png' }] })
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      )
    }
  }
}
