module.exports = {
  config: {
    name: 'rank',
    usage: 'rank',
    aliases: [],
    description: 'rank',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const target = message.mentions.users.first() || message.author // Grab the target.

    const user = await client.levels.fetch(target.id, message.guild.id) // Selects the target from the database.

    if (!user) {
      return message.channel.send(
        'Seems like this user has not earned any xp so far.'
      )
    } // If there isnt such user in the database, we send a message in general.

    message.channel.send(
      `> **${target.tag}** is currently level ${user.level}.`
    ) // We show the level.
  }
}
