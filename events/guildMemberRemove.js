const Discord = require("discord.js");
const Canvas = require("discord-canvas");
module.exports = (client) => {
  return async function (member) {
    const channel = member.guild.channels.cache.find(
      (ch) => ch.name === "new-member"
    );
    if (!channel) return;
    const image = await new Canvas.Goodbye()
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator)
      .setMemberCount(member.guild.members.cache.size)
      .setGuildName(member.guild.name)
      .setAvatar(
        member.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setColor("border", "#8015EA")
      .setColor("username-box", "#8015EA")
      .setColor("discriminator-box", "#8015EA")
      .setColor("message-box", "#8015EA")
      .setColor("title", "#8015EA")
      .setColor("avatar", "#8015EA")
      // .setBackground("")
      .toAttachment();

    const attachment = new Discord.MessageAttachment(
      image.toBuffer(),
      "goodbye-image.png"
    );
    channel.send(attachment);
  };
};
