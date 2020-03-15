//let commandModel = require("../../model/cac");
module.exports = {
  config: {
    name: "ping",
    usage: "playlist --arguement [playlist name] [url]",
    description: "Show top songs played by me",
    ownerOnly: false,
    enabled: true
  },
  run: async (client, message, args) => {
    //commandModel.sendMessage(message.channel);
  }
};
