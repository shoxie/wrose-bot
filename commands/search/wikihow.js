const request = require("node-superfetch");
const { stripIndents } = require("common-tags");
module.exports = {
  config: {
    name: "wikihow",
    usage: "wikihow",
    aliases: [],
    description: "Send a wikihow",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let query = args.join(" ");
    console.log(query)
    try {
      const { body } = await request
        .get("https://www.wikihow.com/api.php")
        .query({
          action: "query",
          prop: "info",
          format: "json",
          titles: query,
          inprop: "url",
          redirects: ""
        });
      const data = body.query.pages[Object.keys(body.query.pages)[0]];
      if (data.missing === "")
        return message.channel.send("Could not find any results.");
      return message.channel.send(stripIndents`
            How to ${data.title}
            ${data.fullurl}
        `);
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
