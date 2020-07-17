const { updateXPstatus } = require("../../model/guildSettingsModel");
const { update } = require("../../model/level");
module.exports = {
  config: {
    name: "enableXP",
    usage: "enableXP",
    aliases: [],
    description: "Turn on/off chat xp for current server",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR"))
      return message.reply("Insufficient permission.");
    if (client.guildSettings.xp == true) {
      client.guildSettings.xp = false;
      updateXPstatus(message.guild.id, false);
      message.reply("Disabled xp for chat.");
    } else {
      client.guildSettings.xp = true;
      updateXPstatus(message.guild.id, true);
      message.reply("Enabled xp for chat.");
    }
  },
};
