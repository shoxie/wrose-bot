const guildSettingsModel = require("../../model/guildSettingsModel");
module.exports = {
  config: {
    name: "reloadDatabase",
    usage: "reloadDatabase",
    description:
      "Reload the whole database, this will overwrite the current database",
    enabled: true
  },
  async run(client, message, args) {
    for (let guildId of client.guilds.keys()) {
      let guildSettings = {
        id: guildId,
        musicVoiceChannel: null,
        musicTextChannel: null,
        ignoreChannels: []
      };
      guildSettingsModel.addNewGuild(guildId, guildSettings);
    }
  }
};
