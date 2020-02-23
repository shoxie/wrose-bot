let mongoose = require("mongoose");
let guildSettingsSchema = mongoose.Schema({
  guildID: {
    type: String,
    unique: true
  },
  guildName: {
    type: String
  },
  musicTextChannel: {
    type: String,
    unique: true
  },
  musicVoiceChannel: {
    type: String,
    unique: true
  },
  ignoredChannels: []
});
var guildSettings = mongoose.model("guildSettings", guildSettingsSchema);
function updateMusicChannel(data) {
  guildSettings.findOneAndUpdate(
    { guildID: data.guildID },
    {
      musicTextChannel: data.musicTextChannel,
      musicVoiceChannel: data.musicVoiceChannel
    },
    function(error, doc, res) {
      if (error) console.log(error);
      if (res) console.log("done");
    }
  );
}
function updateIgnoredChannels(data) {
  guildSettings.findOne({ guildID: data.guildID }, function(error, result) {
    if (error) console.log(error);
    if (result) {
      result.ignoredChannels.push(data.ignoredChannel);
      result.save().then(() => {
        console.log("saved ignore channel");
      });
    }
  });
}

function addNewGuild(guild) {
  let newGuild = new guildSettings({
    guildID: guild.id,
    guildName: guild.name,
    musicVoiceChannel: null,
    musicTextChannel: null
  });
  return newGuild.save().then(function(err) {
    if (err) console.log(err);
  });
}
async function queryGuildSettings(guildID) {
  let result = await guildSettings.findOne({ guildID: guildID }).exec();
  return result;
}
module.exports = {
  updateIgnoredChannels,
  updateMusicChannel,
  addNewGuild,
  queryGuildSettings
};
