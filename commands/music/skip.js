let musicModel = require("../../model/model");
module.exports = {
    config: {
        name: "skip",
        usage: "skip",
        enabled: true
    },
    async run(message, args) {
        if (message.member.voiceChannelID != musicModel.voiceChannel.id) {
            // undefined
            return message.channel.send({
                embed: {
                    title: "You have to be in the same channel with the me to use the command"
                }
            });
        }
        if (!musicModel.queue[0]) {
            message.channel.send({
                embed: {
                    color: 15158332,
                    title: "No songs in the queue"
                }
            });
        }
        musicModel.connection.dispatcher.end();

        function roleCheck(config) {

        }
    }
};