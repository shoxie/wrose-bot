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
    message.channel.send("Nickname ?");
    let collected = await message.channel.awaitMessages(
      m => m.author.id === message.author.id,
      {
        max: 1,
        time: 30000
      }
    );
    let nickname = collected.first().content;
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
      if (!nickname)
        return message.reply("Successfully removed all nicknames!");
      return message.reply(
        `Successfully renamed all but ${i} member${
          i === 1 ? "" : "s"
        } to **${nickname}**!`
      );
    } catch (err) {
      return message.reply(`Failed to rename everyone: \`${err.message}\``);
    }
  }
};
