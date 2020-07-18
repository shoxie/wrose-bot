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
    let serverSettings = client.guildSettings.get(message.guild.id);
    if (serverSettings.xp == true) {
      serverSettings.xp = false;
      updateXPstatus(message.guild.id, false);
      message.reply("Disabled xp for chat.");
    } else {
      serverSettings.xp = true;
      updateXPstatus(message.guild.id, true);
      message.reply("Enabled xp for chat.");
    }
  },
};
