let mongoose = require("mongoose");
let guildSettingsSchema = mongoose.Schema({
  guildID: {
    type: String,
    unique: true
  },
  guildName: {
    type: String
  },
  prefix: {
    type: String,
    max: 1,
    default: "."
  },
  musicTextChannel: {
    type: String,
  },
  musicVoiceChannel: {
    type: String,
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
        console.log("saved ignore channel\n" + result);
      });
    }
  });
}

async function addNewGuild(guild) {
  guildSettings.findOne({ guildID: guild.id }, async function(error, result) {
    if (error) console.log(error);
    if (result) return;
    if (!result) {
      let newGuild = new guildSettings({
        guildID: guild.id,
        guildName: guild.name,
        musicVoiceChannel: null,
        musicTextChannel: null
      });
      await newGuild.save().then(function(err) {
        if (err) console.log(err);
        console.log("saved new guild\n" + newGuild);
      });
    }
  });
}
async function queryGuildSettings(guildID) {
  let result = await guildSettings.findOne({ guildID: guildID }).exec();
  return result;
}
async function updatePrefix(prefix, guildID) {
  let a = await guildSettings.findOneAndUpdate(
    { guildID: guildID },
    {
      prefix: prefix
    }
  );
  return a;
}
module.exports = {
  updateIgnoredChannels,
  updateMusicChannel,
  addNewGuild,
  queryGuildSettings,
  updatePrefix
};
