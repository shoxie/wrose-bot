const { createCanvas, loadImage } = require("canvas");
const request = require("node-superfetch");
module.exports = {
  config: {
    name: "drawAvatar",
    usage: "drawAvatar [base userID] [overlay userID]",
    aliases: [],
    description: "Combine two user avatars into one",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (!args[0] || !args[1]) return message.channel.send("Specify user ids!");
    const baseAvatarURL = await message.guild.members.cache
      .get(args[0])
      .user.displayAvatarURL({ format: "png", size: 1024 });
    const overlayAvatarURL = await message.guild.members.cache
      .get(args[1])
      .user.displayAvatarURL({ format: "png", size: 512 });
    if (!baseAvatarURL || !overlayAvatarURL)
      return message.channel.send("Wrong user ids");
    try {
      const baseAvatarData = await request.get(baseAvatarURL);
      const baseAvatar = await loadImage(baseAvatarData.body);
      const overlayAvatarData = await request.get(overlayAvatarURL);
      const overlayAvatar = await loadImage(overlayAvatarData.body);
      const canvas = createCanvas(baseAvatar.width, baseAvatar.height);
      const ctx = canvas.getContext("2d");
      ctx.globalAlpha = 0.5;
      ctx.drawImage(baseAvatar, 0, 0);
      ctx.drawImage(overlayAvatar, 0, 0, baseAvatar.width, baseAvatar.height);
      return message.channel.send({
        files: [{ attachment: canvas.toBuffer(), name: "avatar-fusion.png" }]
      });
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
