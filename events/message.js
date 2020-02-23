const config = require("../config/config.json");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const guildSettingsAdapter = new FileSync("./data/guildSettings.json");
const guildSettings = low(guildSettingsAdapter);
module.exports = client => {
  return async function(message) {
    //args definition
    const args = message.content
      .slice(config.prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();
    //message filter
    let guildID = message.guild.id;
    if (message.author.bot) {
      return;
    }
    // ignore message when it's in ignored channels
    let ignoredChannels = client.guildSettings.get(guildID).ignoredChannels;
    for (let ignoredChannel of ignoredChannels) {
      if (message.channel.id === ignoredChannel) {
        return;
      }
    }
    //delete message when it's in delete channels
    let musicTextChannel = client.guildSettings.get(guildID).musicTextChannel;
    if (
      message.channel.id === musicTextChannel &&
      !message.content.startsWith(config.prefix)
    ) {
      //console.log(message.channel.id === musicTextChannel[key]);

      message.delete();
    }
    //command execution
    if (cmd.length === 0) return;
    if (
      message.content.startsWith(config.prefix) &&
      cmd.length !== 0 &&
      client.commands.has(cmd)
    ) {
      if (client.commands.get(cmd).config.enabled === true)
        client.commands.get(cmd).run(client, message, args);
    }
  };
};
