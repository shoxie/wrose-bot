const neko = require('nekos.life')
const owo = new neko()
const { blueMessage, redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'neko',
    usage: 'neko',
    aliases: [],
    description: 'Show random nsfw neko image',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    if (!message.channel.nsfw) return redMessage(message, 'Error', 'This channel is not a nsfw channel.')
    const img = (await owo.nsfw.nekoGif())
    if (!img) return redMessage(message, 'Something happened', ':sad:')
    message.channel.send(img.url)
  }
}
