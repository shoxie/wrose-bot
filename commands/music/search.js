let guildSettings = require("../../model/guildSettingsModel");
module.exports = {
  config: {
    name: "search",
    usage: "search [args]",
    description: "Honestly this is my dev test command",
    enabled: false
  },
  async run(client, message, args) {
    let data = await guildSettings.queryGuildSettings(message.member.guild.id);
    console.log(typeof data.ignoredChannels);
  }
};
