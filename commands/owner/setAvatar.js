const { redMessage } = require("../../utils/message");
module.exports = {
  config: {
    name: "setAvatar",
    usage: "setAvatar",
    aliases: [],
    description: "Set bot avatar",
    ownerOnly: true,
    enabled: true,
  },
  async run(client, message, args) {
    if (message.deletable) {
      message.delete();
    }
    if (!args || args.length < 1) {
      return redMessage(
        message,
        "Please provide me with a valid link to set my avatar."
      );
    }
    client.user.setAvatar(args.join(" "));

    message.channel
      .send("Profile photo has been changed!")
      .then((m) => m.delete({ timeout: 5000 }));
  },
};
