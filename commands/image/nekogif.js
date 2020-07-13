const neko = require('nekos.life')
const owo = new neko()
const { redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'nekogif',
    usage: 'nekogif',
    aliases: [],
    description: 'Show random neko gif',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const img = (await owo.sfw.nekoGif())
    if (!img) return redMessage(message, 'Something happened', ':sad:')
    message.channel.send(img.url)
  }
}
