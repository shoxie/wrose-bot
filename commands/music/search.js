const guildSettings = require('../../model/guildSettingsModel')
module.exports = {
  config: {
    name: 'search',
    usage: 'search [args]',
    description: 'Honestly this is my dev test command',
    ownerOnly: true,
    enabled: true
  },
  async run (client, message, args) {
    const data = await guildSettings.queryGuildSettings(message.member.guild.id)
    console.log(typeof data.ignoredChannels)
  }
}
