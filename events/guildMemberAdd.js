const path = require('path')
const Discord = require('discord.js')
const Canvas = require('discord-canvas')
const roleModel = require('../model/role.model')
module.exports = (client) => {
  return async function (member) {
    const channel = member.guild.channels.cache.find(
      (ch) => ch.name === 'new-member'
    )
    if (!channel) return
    const image = await new Canvas.Welcome()
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator)
      .setMemberCount(member.guild.members.cache.size)
      .setGuildName(member.guild.name)
      .setAvatar(
        member.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
      )
      .setColor('border', '#8015EA')
      .setColor('username-box', '#8015EA')
      .setColor('discriminator-box', '#8015EA')
      .setColor('message-box', '#8015EA')
      .setColor('title', '#8015EA')
      .setColor('avatar', '#8015EA')
      // .setBackground("")
      .toAttachment()

    const attachment = new Discord.MessageAttachment(
      image.toBuffer(),
      'goodbye-image.png'
    )
    channel.send(attachment)
    if (!process.env.capcha) return
    if (process.env.capcha === 'true') {
      var targetRole = await roleModel.getByType('capcha')
      var role = await member.guild.roles.cache.find(
        (damnRole) => damnRole.id === targetRole[0].roleID
      )
      if (role) await member.roles.add(role)
      const msg = await member.send('react to this')
      msg.react('👍').then(() => msg.react('👎'))

      const filter = (reaction, user) => {
        return (
          ['👍', '👎'].includes(reaction.emoji.name) && user.id === member.id
        )
      }

      msg
        .awaitReactions(filter, { max: 1, time: 60000, errors: ['time'] })
        .then(async (collected) => {
          const reaction = collected.first()

          if (reaction.emoji.name === '👍') {
            msg.reply('you reacted with a 👍.')
            member.roles.remove(role)
          }
          if (reaction.emoji.name === '👎') {
            await member.kick()
          }
        })
        .catch((collected) => {
          msg.reply('you reacted with neither a thumbs up, nor a thumbs down.')
        })
    }
    const toAdd = await roleModel.getByType('auto')
    for (toAddRole of toAdd) {
      var findRole = await member.guild.roles.cache.find(
        (damnRole) => damnRole.id === toAddRole.id
      )
      member.roles.add(findRole)
    }
  }
}
