const guildSettings = require("../../model/guildSettingsModel");
module.exports = {
  config: {
    name: "ignoreChannels",
    usage: "ignoreChannels [channelID]",
    description:
      "Set a text channel as an ignored channel, i will not notice any messages from this channel",
    enabled: true
  },
  async run(client, message, args) {
    if (message.member.guild.channels.cache.find(x => x.id === args[0])) {
      let data = {
        guildID: message.member.guild.id,
        ignoredChannels: args[0]
      };
      guildSettings.updateIgnoredChannels(data);
      client.guildSettings.set(data.guildID, data);
      message.channel.send({
        embed: {
          color: 3447003,
          title:
            message.member.guild.channels.cache.find(x => x.id === args[0])
              .name + " will be ignored"
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
