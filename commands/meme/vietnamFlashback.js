const { createCanvas, loadImage } = require('canvas');
const request = require('node-superfetch');
const path = require('path');

module.exports = {
  config: {
    name: "vietnamFlashback",
    usage: "vietnamFlashback",
    aliases: [],
    description: "Send user avatar with vietnamFlashback at behind",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let image = message.author.displayAvatarURL({ format: "png", size: 512 });
    try {
        const base = await loadImage(path.join(__dirname, '..', '..', 'assets', 'vietnam-flashbacks.png'));
        const { body } = await request.get(image);
        const data = await loadImage(body);
        const canvas = createCanvas(data.width, data.height);
        const ctx = canvas.getContext('2d');
        const ratio = base.width / base.height;
        const width = Math.round(data.height * ratio);
        ctx.drawImage(base, (data.width / 2) - (width / 2), 0, width, data.height);
        ctx.globalAlpha = 0.675;
        ctx.drawImage(data, 0, 0);
        const attachment = canvas.toBuffer();
        if (Buffer.byteLength(attachment) > 8e+6) return message.reply('Resulting image was above 8 MB.');
        return message.channel.send({ files: [{ attachment, name: 'vietnam-flashbacks.png' }] });
    } catch (err) {
        return message.reply(`Oh no, an error occurred: \`${err.message}\`. Try again later!`);
    }
  }
};
