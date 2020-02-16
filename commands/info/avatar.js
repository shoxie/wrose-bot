module.exports = {
    config: {
        name: "avatar",
        usage: "avatar @user",
        description: 'Show the default resolution of a user avatar',
        enabled: true
    }, //hold up
    async run(client, message, args) {
        if (message.mentions.users.first()) {
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
            });
        }
        if (!message.mentions.users.first()) {
            return message.channel.send({
                embed: {
                    color: 15158332,
                    title: 'You have to mention the one who want me to get avatar',
                }
            })
        }
    }
}