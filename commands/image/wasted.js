module.exports = {
  config: {
    name: 'wasted',
    usage: 'wasted',
    aliases: [],
    description: 'Draw wasted overlay on user avatar',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const user = message.mentions.users.first()
      ? message.mentions.users.first()
      : message.author
    const userAvatar = user.avatarURL({
      format: 'png',
      dynamic: true,
      size: 1024
    })
    const url = 'https://some-random-api.ml/canvas/wasted?avatar=' + userAvatar
    message.channel.send(url)
  }
}
