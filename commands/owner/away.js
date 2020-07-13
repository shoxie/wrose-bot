const Discord = require('discord.js')
module.exports = {
  config: {
    name: 'away',
    usage: 'away',
    description:
      'Set away status and send message to anyone who mention my owner',
    ownerOnly: true,
    enabled: true
  },
  async run (client, message, args) {
    client.awayuser = new Discord.Collection()
    client.awayuser.set(message.member.user.username, message.member)
    if (args[0] === '-remove') {
      client.awayuser.delete(message.member.user.username)
    }
  }
}
