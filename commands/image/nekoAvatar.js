const neko = require('nekos.life')
const owo = new neko()
const { blueMessage, redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'nekoAvatar',
    usage: 'nekoAvatar',
    aliases: [],
    description: 'Show random neko avatar',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const img = await owo.sfw.avatar()
    if (!img) return redMessage(message, 'Something happened', ':sad:')
    message.channel.send(img.url)
  }
}
