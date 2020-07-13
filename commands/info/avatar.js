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
    if (message.mentions.users.first()) {
      message.channel.send({
        embed: {
          color: 3447003,
          fields: [
            {
              name: 'Avatar',
              value: message.mentions.users.first().tag
            }
          ],
          image: {
            url: message.mentions.users
              .first()
              .avatarURL({ format: 'png', dynamic: true, size: 1024 })
          },
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL({
              format: 'png',
              dynamic: true,
              size: 1024
            })
          }
        }
      })
    }
    if (!message.mentions.users.first()) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: 'You have to mention the one who want me to get avatar'
        }
      })
    }
  }
}
