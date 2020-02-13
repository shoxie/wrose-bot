module.exports = {
    name: 'avatar',
    async run(message, args) {
        message.channel.send({
            embed: {
                color: 3447003,
                fields: [{
                    name: 'Avatar',
                    value: message.mentions.users.first().tag
                }],
                image: {
                    url: message.mentions.users.first().avatarURL
                }
            }
        })
    }
}