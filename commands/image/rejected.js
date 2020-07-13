const { createCanvas, loadImage } = require('canvas')
const request = require('node-superfetch')
const path = require('path')
const util = require('../../utils/utility')

module.exports = {
  config: {
    name: 'rejected',
    usage: 'rejected',
    aliases: [],
    description: 'Put a rejected stamp on your avatar',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const image = message.author.displayAvatarURL({ format: 'png', size: 512 })
    try {
      const base = await loadImage(
        path.join(__dirname, '..', '..', 'assets', 'rejected.png')
      )
      const { body } = await request.get(image)
      const data = await loadImage(body)
      const canvas = createCanvas(data.width, data.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(data, 0, 0)
      const { x, y, width, height } = util.centerImage(base, data)
      ctx.drawImage(base, x, y, width, height)
      const attachment = canvas.toBuffer()
      if (Buffer.byteLength(attachment) > 8e6) { return message.reply('Resulting image was above 8 MB.') }
      return message.channel.send({
        files: [{ attachment, name: 'rejected.png' }]
      })
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      )
    }
  }
}
