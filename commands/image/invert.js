const { createCanvas, loadImage } = require('canvas')
const request = require('node-superfetch')
const util = require('../../utils/utility')

module.exports = {
  config: {
    name: 'invert',
    usage: 'invert',
    aliases: [],
    description: 'Your avatar but inverted color',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const image = message.author.displayAvatarURL({ format: 'png', size: 512 })
    try {
      const { body } = await request.get(image)
      const data = await loadImage(body)
      const canvas = createCanvas(data.width, data.height)
      const ctx = canvas.getContext('2d')
      ctx.drawImage(data, 0, 0)
      util.invert(ctx, 0, 0, data.width, data.height)
      const attachment = canvas.toBuffer()
      if (Buffer.byteLength(attachment) > 8e6) { return msg.reply('Resulting image was above 8 MB.') }
      return message.channel.send({
        files: [{ attachment, name: 'invert.png' }]
      })
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      )
    }
  }
}
