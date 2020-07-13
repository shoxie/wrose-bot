const { createCanvas, loadImage, registerFont } = require('canvas')
const { stripIndents } = require('common-tags')
const path = require('path')
const { wrapText } = require('../../utils/canvas')
const texts = require('../../assets/json/be-like-bill')
registerFont(
  path.join(__dirname, '..', '..', 'assets', 'fonts', 'arialbd.ttf'),
  { family: 'Arial', weight: 'bold' }
)

module.exports = {
  config: {
    name: 'beLikeBill',
    usage: 'beLikeBill',
    aliases: [],
    description: 'Send a beLikeBill meme',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    message.channel.send('Input meme name')
    const collected = await message.channel.awaitMessages(
      m => m.author.id === message.author.id,
      {
        max: 1,
        time: 30000
      }
    )
    const name = collected.first().content
    const base = await loadImage(
      path.join(__dirname, '..', '..', 'assets', 'be-like-bill.png')
    )
    const canvas = createCanvas(base.width, base.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(base, 0, 0)
    ctx.font = 'normal bold 23px Arial'
    const text = await wrapText(
      ctx,
      texts[Math.floor(Math.random() * texts.length)].replace(
        /{{name}}/gi,
        name
      ),
      569
    )
    ctx.fillText(
      stripIndents`
        This is ${name}.
        ${text.join('\n')}
        ${name} is smart.
        Be like ${name}.
    `,
      31,
      80
    )
    return message.channel.send({
      files: [{ attachment: canvas.toBuffer(), name: 'be-like-bill.png' }]
    })
  }
}
