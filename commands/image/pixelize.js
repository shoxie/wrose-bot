const { createCanvas, loadImage } = require('canvas')
const request = require('node-superfetch')
module.exports = {
  config: {
    name: 'pixelize',
    usage: 'pixelize',
    aliases: ['pz'],
    description: 'Pixelize your avatar',
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
      ctx.imageSmoothingEnabled = false
      const width = canvas.width * 0.15
      const height = canvas.height * 0.15
      ctx.drawImage(data, 0, 0, width, height)
      ctx.drawImage(
        canvas,
        0,
        0,
        width,
        height,
        0,
        0,
        canvas.width,
        canvas.height
      )
      const attachment = canvas.toBuffer()
      if (Buffer.byteLength(attachment) > 8e6) { return message.reply('Resulting image was above 8 MB.') }
      return message.channel.send({
        files: [{ attachment, name: 'pixelize.png' }]
      })
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      )
    }
  }
}
