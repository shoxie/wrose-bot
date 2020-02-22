const config = require("../config/config.json");
var { db, database } = require("../model/db.js");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const guildSettingsAdapter = new FileSync("./data/guildSettings.json");
const guildSettings = low(guildSettingsAdapter);
module.exports = client => {
  return async function(message) {
    const args = message.content
      .slice(config.prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if (cmd.length === 0) return;
    if (
      message.content.startsWith(config.prefix) &&
      cmd.length !== 0 &&
      client.commands.has(cmd)
    ) {
      if (client.commands.get(cmd).config.enabled === true)
        client.commands.get(cmd).run(client, message, args);
    }
    let guildID = message.guild.id;
    let dbExist = db.get(`${guildID}`).value();
    if (message.author.bot) return;
    if (!dbExist) {
      database.getDB(guildID);
    }
    await guildSettings.read();
    let textChannel = guildSettings
      .get("guild")
      .find({
        id: message.member.guild.id
      })
      .value();
    let textChannelId;
    if (textChannel) {
      textChannelId = textChannel.musicTextChannel;
    }
    console.log(textChannel);
    if (
      textChannelId &&
      !message.content.startsWith(config.prefix) &&
      message.channel.id === textChannelId
    ) {
      message.delete();
    }
  };
};
