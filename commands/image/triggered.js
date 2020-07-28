module.exports = {
  config: {
    name: 'triggered',
    usage: 'triggered',
    aliases: [],
    description: 'Draw triggered overlay on user avatar',
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
    const url = 'https://some-random-api.ml/canvas/triggered?avatar=' + userAvatar
    message.channel.send(url)
  }
}
