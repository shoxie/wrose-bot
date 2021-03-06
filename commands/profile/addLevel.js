module.exports = {
  config: {
    name: 'addLevel',
    usage: 'Tag a user or trigger the command to start',
    aliases: ['addlvl'],
    description: 'Add a specific amount of lvl to target user',
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
    const f = await client.levels.appendLevel(userid, message.guild.id, amount)
    const user = await client.users.fetch(f.userID)
    message.reply(user.tag + ` level changed from ${baseAmount.level} to ${f.level}`)
  }
}
