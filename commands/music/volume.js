let musicModel = require("../../model/model");
module.exports = {
  config: {
    name: "volume",
    usage: "volume [0-1]",
    description: "Adjust the song volume",
    enabled: true
  },
  async run(client, message, args) {
    if (message.args[0] < 0 && message.args[0] > 1) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title:
            "Wrong usage, please read the command usage using __.help volume__"
        }
      });
    }
    musicModel.dispatcher.setVolume(args[0]);
  }
};
