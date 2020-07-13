const { Canvas } = require('canvas-constructor')
const { get } = require('node-superfetch')
const Discord = require('discord.js')

module.exports = {
  config: {
    name: '',
    usage: '',
    aliases: [],
    description: '',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const curOnline = message.guild.members.cache.filter(m => m.presence.status == 'online').size
    const curOffline = message.guild.members.cache.filter(m => m.presence.status == 'offline').size
    const curDnd = message.guild.members.cache.filter(m => m.presence.status == 'dnd').size
    const curIdle = message.guild.members.cache.filter(m => m.presence.status == 'idle').size
    const guildMembers = message.guild.memberCount
    if (curOnline == 0) {
      var differenceOnline = 10
    } else {
      var differenceOnline = curOnline / guildMembers * 240
    }

    if (curOffline == 0) {
      var differenceOffline = 10
    } else {
      var differenceOffline = curOffline / guildMembers * 240
    }

    if (curDnd == 0) {
      var differenceDnd = 10
    } else {
      var differenceDnd = curDnd / guildMembers * 240
    }

    if (curIdle == 0) {
      var differenceIdle = 10
    } else {
      var differenceIdle = curIdle / guildMembers * 240
    }
    var backGroundArray = await new Array('https://cdn.probot.io/profile/ScumID-1.jpg', 'https://cdn.probot.io/profile/ScumID-2.jpg', 'https://cdn.probot.io/profile/17.png', 'https://cdn.probot.io/profile/boy1.jpg',
      'https://cdn.probot.io/profile/bg-8.png', 'https://cdn.probot.io/profile/breakingbad.jpg', 'https://cdn.probot.io/profile/03404.png', 'https://cdn.probot.io/profile/123123123.png', 'https://cdn.probot.io/profile/sdffdssdf.png',
      'https://cdn.probot.io/profile/walking_dead2.png', 'https://cdn.probot.io/profile/got2.png', 'https://cdn.probot.io/profile/ragnar.jpg')
    var mathBackGround = await backGroundArray[Math.floor(Math.random() * backGroundArray.length)]
    if (message.guild.iconURL() == null) {
      var { body: guildIcon } = await get('https://www.net-aware.org.uk/siteassets/images-and-icons/application-icons/app-icons-discord.png?w=585&scale=down')
    } else if (message.guild.iconURL() !== null) {
      var { body: guildIcon } = await get(message.guild.iconURL({ format: 'png', dynamic: false, size: 128 }))
    }
    var { body: backGround } = await get(mathBackGround)

    const buffer = await new Canvas(540, 250)
      .setGlobalAlpha(0.5)
      .setColor('#33cc99')
      .addBeveledRect(490, 47, 50, 30)
      .setColor('#A9A9A9')
      .addBeveledRect(490, 90, 50, 30)
      .setColor('#ff3333')
      .addBeveledRect(490, 133, 50, 30)
      .setColor('#ff9933')
      .addBeveledRect(490, 176, 50, 30)
      .setGlobalAlpha(1)
      .setTextAlign('center')
      .setTextFont('bold 15px Impact')
      .setColor('#000000')
      .addText(curOnline, 519, 68)
      .addText(curOffline, 519, 111)
      .addText(curDnd, 519, 154)
      .addText(curIdle, 519, 197)
      .addBeveledImage(backGround, 0, 0, 500, 250)
      .setColor('BLACK')
      .addBeveledRect(495, -2, 5, 255, 15)
      .setColor('#303030')
      .setGlobalAlpha(0.5)
      .addBeveledRect(20, 20, 460, 210, 15)
      .fill().restore()
      .setColor('white')
      .setGlobalAlpha(0.2)
      .addBeveledRect(225, 47, 240, 30)
      .addBeveledRect(225, 90, 240, 30)
      .addBeveledRect(225, 133, 240, 30)
      .addBeveledRect(225, 176, 240, 30)
      .setGlobalAlpha(1)
      .setColor('#33cc99')
      .addBeveledRect(225, 47, differenceOnline, 30)
      .setColor('#A9A9A9')
      .addBeveledRect(225, 90, differenceOffline, 30)
      .setColor('#ff3333')
      .addBeveledRect(225, 133, differenceDnd, 30)
      .setColor('#ff9933')
      .addBeveledRect(225, 176, differenceIdle, 30)
      .setColor('#FFFFFF')
      .addBeveledRect(40, 40, 170, 170, 40)
      .fill().restore()
      .addBeveledImage(guildIcon, 40, 40, 170, 170, 16)
      .save()
      .toBuffer()

    try {
      const filename = `${message.guild.name}-members.jpg`
      const attachment = new Discord.MessageAttachment(buffer, filename)
      await message.channel.send(attachment)
    } catch (error) {
      return message.channel.send(`An error ocurred: **${error.message}**`)
    }
  }
}
