module.exports = {
  config: {
    name: 'avatar',
    usage: 'avatar @user',
    aliases: ['avt'],
    description: 'Show the default resolution of a user avatar',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const user = message.mentions.users.first()
      ? message.mentions.users.first()
      : message.author
    if (user) {
      message.channel.send({
        embed: {
          color: 3447003,
          fields: [
            {
              name: 'Avatar',
              value: user.tag
            }
          ],
          image: {
            url: user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
          },
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL({
              format: 'png',
              dynamic: true
            })
          }
        }
      })
    }
  }
}
