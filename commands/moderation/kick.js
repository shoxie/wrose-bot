const { verify } = require('../../utils/utility')
module.exports = {
  config: {
    name: 'kick',
    usage: 'kick [user] [reason]',
    description: 'Kick a specific person',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    if (!message.member.hasPermission('KICK_MEMBERS')) { return message.reply('fuck you blyat') }
    try {
      const user = await message.mentions.members.first()
      if (!user) {
        message.channel.send({
          embed: {
            title: '__***PICK A USER FOOL***__',
            color: 15158332
          }
        })
      }
      const reason = args[1] ? args[1] : 'Not specified'
      const verification = await verify(message.channel, message.author)
      if (!verification) return message.reply('aborted')
      user.kick(reason)
      const kickedUser = await client.users.fetch(user.id)
      message.channel.send({
        embed: {
          color: 15158332,
          title: message.author.tag + ' has removed a member from this guild',
          fields: [
            { name: 'User', value: kickedUser.username },
            { name: 'Reason', value: reason }
          ]
        }
      })
    } catch (e) {
      message.author.send(e)
    }
  }
}
