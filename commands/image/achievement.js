const { createCanvas, loadImage, registerFont } = require('canvas')
const path = require('path')
const util = require('../../utils/utility')
registerFont(
  path.join(__dirname, '..', '..', 'assets', 'fonts', 'Minecraftia.ttf'),
  { family: 'Minecraftia' }
)

module.exports = {
  config: {
    name: 'achievement',
    usage: 'achievement',
    description: 'Draw custom achievement',
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
    const base = await loadImage(
      path.join(__dirname, '..', '..', 'assets', 'achievement.png')
    )
    const canvas = createCanvas(base.width, base.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(base, 0, 0)
    ctx.font = '17px Minecraftia'
    ctx.fillStyle = '#ffff00'
    ctx.fillText('Achievement Get!', 60, 40)
    ctx.fillStyle = '#ffffff'
    ctx.fillText(util.shortenText(ctx, collected.first().content, 230), 60, 60)
    return message.channel.send({
      files: [{ attachment: canvas.toBuffer(), name: 'achievement.png' }]
    })
  }
}
