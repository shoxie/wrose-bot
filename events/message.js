let util = require("../utils/utility");
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
    if (message.author.bot) return;
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
    if (message.content.startsWith(config.prefix)) {
      let alias = client.aliases;
      if (client.commands.has(cmd)) {
        if (client.commands.get(cmd).config.enabled === true)
          client.commands.get(cmd).run(client, message, args);
      } else if (client.aliases.has(cmd)) {
        if (client.aliases.get(cmd).config.enabled === true)
          client.aliases.get(cmd).run(client, message, args);
      }
    }

    if (message.mentions.users.has(client.user.id)) {
      message.channel.send("My prefix is " + config.prefix);
    }

    //misc utilities
    if (message.channel.id === "683780012541083704") {
      let util = require("../utils/utility");
      util.sendResponse(message);
    }
    if (client.awayuser && message.mentions.users.first()) {
      let mentionedUser = message.mentions.users.first().username;

      if (
        message.mentions.users.has(client.awayuser.get(mentionedUser).user.id)
      ) {
        util.sendShit(message);
      }
    }
  };
};
