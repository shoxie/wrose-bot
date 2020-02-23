const guildSettingsModel = require("../../model/guildSettingsModel");
module.exports = {
  config: {
    name: "ignoreChannels",
    usage: "ignoreChannels [channelID]",
    description:
      "Set a text channel as an ignored channel, i will not notice any messages from this channel",
    enabled: true
  },
  async run(client, message, args) {
    if (message.member.guild.channels.find(x => x.id === args[0])) {
      guildSettingsModel.update(args[0], message.member.guild.id);
      message.channel.send({
        embed: {
          color: 3447003,
          title:
            message.member.guild.channels.find(x => x.id === args[0]).name +
            " will be ignored"
        }
      });
    } else {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "No such channel found."
        }
      });
    }
  }
};
