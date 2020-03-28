const request = require("node-superfetch");
const { list } = require("../../utils/utility");
const products = require("../../assets/json/apple-engraving");

module.exports = {
  config: {
    name: "appleEngrave",
    usage: "appleEngrave [text]",
    aliases:[],
    description: "No idea what im doing",
    ownerOnly: false,
    enabled: false
  },
  async run(client, message, args) {
    message.channel.send("What text you wanna create ?");
    let collected = await message.channel.awaitMessages(
      m => m.author.id === message.author.id,
      {
        max: 1,
        time: 30000
      }
    );
    try {
      const { body } = await request
        .get(
          `https://www.apple.com/shop/preview/engrave/${products[product]}/A`
        )
        .query({
          th: text,
          s: 2,
          f: "font1"
        });
      return message.channel.send({
        files: [{ attachment: body, name: "apple-engraving.jpg" }]
      });
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
