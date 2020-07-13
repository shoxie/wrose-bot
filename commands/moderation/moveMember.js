const { verify } = require('../../utils/utility')
module.exports = {
  config: {
    name: 'moveMembers',
    usage: 'moveMembers [source] [destination]',
    description: 'Move all members from one channel to another',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    //  let role = message.guild.roles.find(x => x.name === "")
    if (!message.member.hasPermission('MOVE_MEMBERS')) return
    try {
      await message.reply('SURE BLYAT ?')
      const verification = await verify(message.channel, message.author)
      if (!verification) return message.reply('FUCK OFF')
      const voiceChannelOriginal = message.member.guild.channels.cache.find(
        (x) => x.id === args[0]
      )
      const destination = message.member.guild.channels.cache.find(
        (x) => x.id === args[1]
      )
      if (voiceChannelOriginal && destination) {
        voiceChannelOriginal.members.forEach(function (member, id) {
          member.voice.setChannel(args[1])
        })
        return message.reply('Your flight has completed')
      }
    } catch (e) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: e.name,
          description: e.message
        }
      })
    }
  }
}
