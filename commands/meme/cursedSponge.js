const { createCanvas, loadImage } = require("canvas");
const path = require("path");
module.exports = {
  config: {
    name: "",
    usage: "",
    aliases: [],
    description: "",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    message.channel.send(
      "How many times do you want to duplicate the cursed sponge?"
    );
    let collected = await message.channel.awaitMessages(
      m => m.author.id === message.author.id,
      {
        max: 1,
        time: 30000
      }
    );
    let amount = parseInt(collected.first().content);
    const sponge = await loadImage(
      path.join(__dirname, "..", "..", "assets", "cursed-sponge.png")
    );
    const rows = Math.ceil(amount / 10);
    const canvas = createCanvas(
      sponge.width * (rows > 1 ? 10 : amount),
      sponge.height * rows
    );
    const ctx = canvas.getContext("2d");
    let width = 0;
    for (let i = 0; i < amount; i++) {
      const row = Math.ceil((i + 1) / 10);
      ctx.drawImage(sponge, width, sponge.height * (row - 1));
      if (width + sponge.width === sponge.width * (rows > 1 ? 10 : amount))
        width = 0;
      else width += sponge.width;
    }
    return message.channel.send({
      files: [{ attachment: canvas.toBuffer(), name: "cursed-sponge.png" }]
    });
  }
};
