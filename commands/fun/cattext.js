let neko = require("nekos.life");
let owo = new neko();
const { blueMessage, redMessage } = require("../../utils/message");
module.exports = {
  config: {
    name: "cattext",
    usage: "cattext",
    aliases: [],
    description: "Show random cat texts from neko.life server",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    let text = await owo.sfw.catText();
    if (!text) return redMessage(message, "Something happened", ":sad:");
    message.reply(text.cat);
  },
};
