const request = require("node-superfetch");
const moment = require("moment");
module.exports = {
  config: {
    name: "newspaper",
    usage: "newspaper",
    aliases: [],
    description: "Draw a fake newspaper",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    message.channel.send("Nhap headline va body trong 2 tin nhan");
    let collected = await message.channel.awaitMessages(
      (m) => m.author.id === message.author.id,
      {
        max: 2,
        time: 30000,
      }
    );
    let headline = collected.array()[0].content;
    let body = collected.array()[1].content;
    if (!headline || !body) return message.reply("STOP SPAMMING NIGGER!");
    try {
      const { text } = await request
        .post("https://www.fodey.com/generators/newspaper/snippet.asp")
        .attach("name", "The Daily Whatever")
        .attach("date", moment().format("dddd, MMMM D, YYYY"))
        .attach("headline", headline)
        .attach("text", body);
      const newspaperURL = text.match(
        /<img src="(https:\/\/r[0-9]+\.fodey\.com\/[0-9]+\/.+\.jpg)"/i
      )[1];
      return message.channel.send({ files: [newspaperURL] });
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  },
};
