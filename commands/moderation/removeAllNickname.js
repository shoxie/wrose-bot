const { verify } = require("../../utils/utility");
module.exports = {
  config: {
    name: "removeAllNickname",
    usage: "removeAllNickname",
    aliases: [],
    description: "Remove nickname of every single member of the server",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    try {
      await message.reply(
        `Are you sure you want to remove all nickname ?`
      );
      const verification = await verify(message.channel, message.author);
      if (!verification) return message.say("Aborted.");
      await message.reply("Fetching members...");
      await message.guild.members.fetch();
      await message.reply("Fetched members! Renaming...");
      let i = 0;
      for (const member of message.guild.members.cache.values()) {
        try {
          await member.setNickname(" ");
        } catch {
          i++;
          continue;
        }
      }
      return message.reply(
        `Successfully renamed all but ${i} member`
      );
    } catch (err) {
      return message.reply(`Failed to rename everyone: \`${err.message}\``);
    }
  }
};
