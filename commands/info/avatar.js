module.exports = {
    config: {
        name: "avatar",
        usage: "avatar @user"
    },
    async run(message, args) {
        console.log(this.config.name)
        if (args[0] == '--help') {
            return sendHelp();
        }
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

        function sendHelp() {
            console.log(this.config.name)
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: `Description of ` + this.config.name,
                    description: this.config.usage,
                    thumbnail: {
                        url: message.client.user.avatarURL
                    },
                    footer: {
                        text: 'Created by wrose'
                    }
                }
            })
        }
    }
}