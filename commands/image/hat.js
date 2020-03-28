const { createCanvas, loadImage } = require("canvas");
const request = require("node-superfetch");
const path = require("path");
// const hats = require("../../assets/json/hat");
module.exports = {
  config: {
    name: "hat",
    usage: "hat [type]",
    aliases: [],
    description:
      "Put a hat on your avatar \n Types: ash, dunce, birthday, christmas, megumin, pilgrim, pirate, tophat, witch  ",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    const avatarURL = await message.guild.members.cache
      .get(message.author.id)
      .user.displayAvatarURL({ format: "png", size: 512 });
    let type = args[0];
    try {
      const base = await loadImage(
        path.join(__dirname, "..", "..", "assets", "hat", `${type}.png`)
      );
      if (!base) return message.channel.send("Invalid type");
      const { body } = await request.get(avatarURL);
      const avatar = await loadImage(body);
      const canvas = createCanvas(avatar.width, avatar.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(avatar, 0, 0);
      ctx.drawImage(base, 0, 0, avatar.width, avatar.height);
      return message.channel.send({
        files: [{ attachment: canvas.toBuffer(), name: `${type}-hat.png` }]
      });
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
