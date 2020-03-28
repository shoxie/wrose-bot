const { createCanvas, loadImage } = require("canvas");
const request = require("node-superfetch");
const path = require("path");

module.exports = {
  config: {
    name: "drake",
    usage: "drake",
    aliases: [],
    description: "Send a drake meme",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    message.channel.send("Tag 2 users");
    let collected = await message.channel.awaitMessages(
      m => m.author.id === message.author.id,
      {
        max: 2,
        time: 30000
      }
    );
    let nahAvatarURL = await message.guild.members.cache
      .get(collected.array()[0].content)
      .user.displayAvatarURL({ format: "png", size: 512 });
    let yeahAvatarURL = await message.guild.members.cache
      .get(collected.array()[1].content)
      .user.displayAvatarURL({ format: "png", size: 512 });
    //const nahAvatarURL = nah.displayAvatarURL({ format: "png", size: 512 });
   // const yeahAvatarURL = yeah.displayAvatarURL({ format: "png", size: 512 });
    try {
      const base = await loadImage(
        path.join(__dirname, "..", "..", "assets", "drakeposting.png")
      );
      const nahAvatarData = await request.get(nahAvatarURL);
      const nahAvatar = await loadImage(nahAvatarData.body);
      const yeahAvatarData = await request.get(yeahAvatarURL);
      const yeahAvatar = await loadImage(yeahAvatarData.body);
      const canvas = createCanvas(base.width, base.height);
      const ctx = canvas.getContext("2d");
      ctx.drawImage(base, 0, 0);
      ctx.drawImage(nahAvatar, 512, 0, 512, 512);
      ctx.drawImage(yeahAvatar, 512, 512, 512, 512);
      return message.channel.send({
        files: [{ attachment: canvas.toBuffer(), name: "drakeposting.png" }]
      });
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
