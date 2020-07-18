const util = require("../utils/utility");
const config = require("../config/config.json");
module.exports = (client) => {
  return async function (message) {
    // let message.guild.id = message.guild.id;
    if (message.guild) {
      const guildConfig = client.guildSettings.get(message.guild.id);
      let prefix = "";
      if (guildConfig) {
        prefix = guildConfig.prefix.toString();
      } else {
        prefix = config.prefix;
      }
      // args definition
      if (prefix.length === 0) return;
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const cmd = args.shift().toLowerCase();
      // message filter

      if (message.author.bot) return;
      // ignore message when it's in ignored channels

      if (guildConfig && guildConfig.ignoredChannels) {
        for (const ignoredChannel of guildConfig.ignoredChannels) {
          if (message.channel.id === ignoredChannel) {
            return;
          }
        }
      }

      // delete message when it's in delete channels
      if (
        guildConfig &&
        message.channel.id === guildConfig.musicTextChannel &&
        !message.content.startsWith(prefix)
      ) {
        // console.log(message.channel.id === musicTextChannel[key]);

        await message.delete();
      }
      //xp
      if (guildConfig.xp == true) {
        const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
        const hasLeveledUp = await client.levels.appendXp(
          message.author.id,
          message.guild.id,
          randomAmountOfXp
        );
        if (hasLeveledUp) {
          const user = await client.levels.fetch(
            message.author.id,
            message.guild.id
          );
          message.channel.send(
            `${message.author}, congratulations! You have leveled up to **${user.level}**. :tada:`
          );
        }
      }
      // command execution
      if (cmd.length === 0) return;
      if (message.content.startsWith(prefix)) {
        const aliases = client.aliases;
        const commands = client.commands;
        const author = message.author;
        const ownerID = client.config.get("ownerID");
        if (commands.has(cmd)) {
          if (commands.get(cmd).config.enabled === false) return;
          if (
            commands.get(cmd).config.ownerOnly === true &&
            author.id !== ownerID
          ) {
            return message.channel.send("You are not the owner");
          } else {
            commands.get(cmd).run(client, message, args);
          }
        } else if (aliases.has(cmd)) {
          if (aliases.get(cmd).config === false) return;
          if (
            aliases.get(cmd).config.ownerOnly === true &&
            author.id !== ownerID
          ) {
            return;
          } else {
            aliases.get(cmd).run(client, message, args);
          }
        }
      }

      if (message.mentions.users.has(client.user.id)) {
        message.channel.send("My prefix is " + prefix);
      }

      // misc utilities
      if (client.awayuser && message.mentions.users.first()) {
        const mentionedUser = message.mentions.users.first().username;

        if (
          message.mentions.users.has(client.awayuser.get(mentionedUser).user.id)
        ) {
          util.sendShit(message);
        }
      }
    }
  };
};
