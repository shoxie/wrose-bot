const Discord = require('discord.js')
module.exports = {
  config: {
    name: 'fakeYoutubeComment',
    usage: 'fakeYoutubeComment',
    aliases: ['fakeyt'],
    description: 'Fake youtube comment',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    await message.delete()
    const user = message.mentions.users.first()
      ? message.mentions.users.first()
      : message.author
    const userAvatar = user.avatarURL({
      format: 'png',
      dynamic: true,
      size: 1024
    })
    if (user) {
      const argsWithoutMentions = []
      const mentions = []

      for (const arg of args) {
        if (Discord.MessageMentions.USERS_PATTERN.test(arg)) mentions.push(arg)
        else argsWithoutMentions.push(arg)
      }
      const url =
        'https://some-random-api.ml/canvas/youtube-comment?comment=' +
        encodeURIComponent(argsWithoutMentions.join(' ')) +
        '&username=' +
        user.username +
        '&avatar=' +
        userAvatar
      const att = new Discord.MessageAttachment(url)
      message.channel.send(att)
    }
  }
}
