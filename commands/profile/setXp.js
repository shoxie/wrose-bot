const momentDurationFormatSetup = require('moment-duration-format')

module.exports = {
  config: {
    name: 'setXp',
    usage: 'Tag a user or trigger the command to start',
    aliases: [],
    description: 'Set target user XP',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    if (!message.member.hasPermission('MANAGE_ROLES')) { return message.reply("You dont't have MANAGE_ROLES permission!") }
    let messageid
    const tempAmount = args[1]
    let amountCollected
    const mention = message.mentions.users.first()
    if (!mention) {
      message.reply('Please send here the target userid')
      const collected = await message.channel.awaitMessages(
        (m) => m.author.id === message.author.id,
        {
          max: 1,
          time: 30000
        }
      )
      if (!collected) return message.reply('Stop spamming the command !')
      messageid = collected.first().content
    }
    if (!tempAmount) {
      message.reply('Please send here the target amount')
      const amountCollector = await message.channel.awaitMessages(
        (m) => m.author.id === message.author.id,
        {
          max: 1,
          time: 30000
        }
      )
      if (!amountCollector) { return message.reply("You didn't reply me with the amount of exp !") }
      amountCollected = amountCollector.first().content
    }
    const userid = mention ? mention.id : messageid
    const amount = tempAmount || amountCollected
    const baseAmount = await client.levels.fetch(userid, message.guild.id)
    const f = await client.levels.setXp(userid, message.guild.id, amount)
    const user = await client.users.fetch(f.userID)
    message.reply(user.tag + ` xp changed from ${baseAmount.xp} to ${f.xp}`)
  }
}
