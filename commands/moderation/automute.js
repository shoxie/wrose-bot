const muteModel = require("../../model/mute.model");
const Pagination = require("discord-paginationembed");

module.exports = {
  config: {
    name: "automute",
    usage: "automute",
    aliases: [],
    description: "Auto mute target user.",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    if (!message.member.hasPermission("MUTE_MEMBERS"))
      return message.reply("Insufficient permission");
    let target = await message.mentions.members.first();
    let targetId = target ? target.id : message.guild.ownerID;
    let userData = await message.guild.members.cache.get(targetId);
    if (!userData)
      message.reply("Something happened, please tag the user probably");
    let user = {
      id: userData.user.id,
      username: userData.user.username,
      discriminator: userData.user.discriminator,
      guildID: message.guild.id,
    };
    if (args.includes("--remove")) {
      muteModel.remove(user);
      message.reply("Automute unbanned for " + user.username);
    } else if (args.includes("--list")) {
      let listdata = await muteModel.list(message.guild.id);
      sendPage(listdata);
    } else {
      const check = await muteModel.exist(user);
      if (check.length !== 0)
        message.reply("User has already in the automute list");
      else await muteModel.add(user);
    }
    async function sendPage(users) {
      let embeds = [];
      users.forEach((entry) => {
        let data = {
          id: entry.id,
          username: entry.username,
          guildID: entry.guildID,
        };
        embeds.push(data);
      });
      let msg = new Pagination.FieldsEmbed()
        .setArray(embeds)
        .setAuthorizedUsers([])
        .setChannel(message.channel)
        .setPageIndicator(true)
        .formatField(`ID`, (i) => i.id)
        .formatField("Username", (i) => i.username)
        .formatField(`GuildID`, (i) => i.guildID)
        .setElementsPerPage(5)
        .setDeleteOnTimeout(true)
        .setEmojisFunctionAfterNavigation(true);
      msg.embed
        .setThumbnail(
          client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
        )
        .setColor("#0390fc")
        .setFooter("Created by wrose");
      await msg.build();
    }
  },
};
