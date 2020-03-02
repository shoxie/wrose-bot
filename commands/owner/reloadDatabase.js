const guildSettings = require("../../model/guildSettingsModel");
module.exports = {
  config: {
    name: "reloadDatabase",
    usage: "reloadDatabase",
    description:
      "Reload the whole database, this will overwrite the current database",
    ownerOnly: true,
    enabled: true
  },
  async run(client, message, args) {
    // for (let guildId of client.guilds.keys()) {
    //   let guildSettings = {
    //     id: guildId,
    //     musicVoiceChannel: null,
    //     musicTextChannel: null,
    //     ignoredChannels: []
    //   };
    //   guildSettingsModel.addNewGuild();
    // }
    let guilds = client.guilds;
    for (const [key, guild] of guilds.entries()) {
      let data = {
        name: guild.name,
        id: guild.id
      };
      await guildSettings.addNewGuild(data);
    }
  }
};
