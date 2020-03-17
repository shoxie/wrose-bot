let guildModel = require("../../model/guildSettingsModel");
module.exports = {
  config: {
    name: "prefix",
    usage: "prefix [new prefix]",
    aliases: [],
    description:
      "Set new prefix for current server. User must have [ADMINISTRATOR] role enabled to use the command.",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR")) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: "Your role does not match the required permission"
        }
      });
    } else {
      try {
        await guildModel.updatePrefix(args[0], message.guild.id);
        client.guildSettings.get(message.guild.id).prefix === args[0];
        message.channel.send({
          embed: {
            color: 3447003,
            title: "Prefix changed to " + args[0]
          }
        });
        client.guildSettings.delete(message.guild.id);
        let data = await guildModel.queryGuildSettings(message.guild.id);
        client.guildSettings.set(message.guild.id, data);
      } catch (error) {
        console.log(error);
      }
    }
  }
};
