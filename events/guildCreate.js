const guildSettings = require('../model/guildSettingsModel')
module.exports = client => {
  return function (guild) {
    //   console.log(guild.id);
    //   let guildId = guild.id;
    //   let guildSettings = {
    //     id: guildId,
    //     musicVoiceChannel: null,
    //     musicTextChannel: null,
    //     ignoredChannels: []
    //   };
    //   guildSettingsModel.addNewGuild(guildId, guildSettings);
    guildSettings.addNewGuild(guild)
  }
}
