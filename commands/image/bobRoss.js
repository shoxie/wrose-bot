const { createCanvas, loadImage } = require("canvas");
const request = require("node-superfetch");
const path = require("path");
module.exports = {
  config: {
    name: "bobRoss",
    usage: "bobRoss",
    aliases: [],
    description: "Tell Bob Ross to draw a picture of you",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    const avatarURL = await message.guild.members.cache
      .get(message.author.id)
      .user.displayAvatarURL({ format: "png", size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, "..", "..", "assets", "bob-ross.png")
      );
      const { body } = await request.get(avatarURL);
      const avatar = await loadImage(body);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, base.width, base.height);
      ctx.drawImage(avatar, 15, 20, 440, 440);
      ctx.drawImage(base, 0, 0);
      return message.channel.send({
        files: [{ attachment: canvas.toBuffer(), name: "bob-ross.png" }]
      });
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
