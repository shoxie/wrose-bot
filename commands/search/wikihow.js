const { stripIndents } = require("common-tags");
const fetch = require("node-fetch");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "wikihow",
    usage: "wikihow",
    aliases: [],
    description: "Send a wikihow",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    let query = args.join("+");
    let url = "https://www.wikihow.com/wikiHowTo?search=" + query;
    fetch(url)
      .then((res) => res.text())
      .then(async (body) => {
        var $ = cheerio.load(body);
        let wikiurl = $("a.result_link").first().attr("href");
        let wikititle = $("div.result_title").first().text();
        message.channel.send({
          embed: {
            color: 3447003,
            title: wikititle,
            fields: [
              {
                name: "URL",
                value: wikiurl,
              },
            ],
            author: {
              name: message.client.user.username,
              icon_url: message.client.user.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              }),
            },
          },
        });
      });
  },
};
