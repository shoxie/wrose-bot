let neko = require("nekos.life");
let owo = new neko();
const { blueMessage, redMessage } = require("../../utils/message");
module.exports = {
  config: {
    name: "nekogif",
    usage: "nekogif",
    aliases: [],
    description: "Show random neko gif",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    let img = (await owo.sfw.nekoGif());
    if (!img) return redMessage(message, "Something happened", ":sad:");
    message.channel.send(img.url)
  },
};
