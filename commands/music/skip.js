let musicModel = require("../../model/model");
module.exports = {
  config: {
    name: "skip",
    usage: "skip",
    description: "Skip a playing song.",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (message.member.guild.id === "335604901730058243") {
      if (!message.member.roles.has("520470163653525505")) {
        return;
      }
    } else {
      if (message.member.voice.channel != musicModel.voiceChannel) {
        // undefined
        return message.channel.send({
          embed: {
            title:
              "You have to be in the same channel with the me to use the command",
            author: {
              name: message.client.user.username,
              icon_url: message.client.user.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024
              })
            }
          }
        });
      }
      if (!musicModel.queue[0]) {
        message.channel.send({
          embed: {
            color: 15158332,
            title: "No songs in the queue",
            author: {
              name: message.client.user.username,
              icon_url: message.client.user.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024
              })
            }
          }
        });
      }
      musicModel.connection.dispatcher.end();
    }
    function roleCheck(config) {}
  }
};
