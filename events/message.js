const guildSettings = require("../model/guildSettingsModel");
let config = require("../config/config.json");
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
    //ignore message when it's in ignored channels
    let guildConfig = client.guildSettings.get(guildID);
    if (guildConfig && guildConfig.ignoredChannels) {
      for (let ignoredChannel of guildConfig.ignoredChannels) {
        if (message.channel.id === ignoredChannel) {
          return;
        }
      }
    }
    //delete message when it's in delete channels
    if (
      guildConfig &&
      message.channel.id === guildConfig.musicTextChannel &&
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
    if (message.mentions.users.has(client.user.id)) {
      message.channel.send("My prefix is " + config.prefix);
    }
    if (message.channel.id === "683780012541083704") {
      let util = require("../utils/utility");
      util.sendResponse(message);
    }
  };
};
