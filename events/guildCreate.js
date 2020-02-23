let guildSettingsModel = require("../model/guildSettingsModel");
module.exports = client => {
  return function(guild) {
    console.log(guild.id);
    let guildId = guild.id;
    let guildSettings = {
      id: guildId,
      musicVoiceChannel: null,
      musicTextChannel: null,
      ignoreChannels: []
    };
    guildSettingsModel.addNewGuild(guildId, guildSettings);
  };
};
