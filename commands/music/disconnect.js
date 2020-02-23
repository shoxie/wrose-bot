let musicModel = require("../../model/model.js");
module.exports = {
  config: {
    name: "disconnect",
    usage: "disconnect",
    description: "Disconnect me from the voiceChannel",
    enabled: true
  },
  async run(client, message, args) {
    musicModel.queue = [];
    if (!musicModel.voiceChannel) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: "__***YOU IDIOT***__",
          description: "I AM NOT EVEN IN A VOICE CHANNEL"
        }
      });
    }
    if (musicModel.voiceChannel) {
      musicModel.connection.dispatcher.end();
      message.channel.send({
        embed: {
          title: "Disconnected from voiceChannel"
        }
      });
    }
  }
};
