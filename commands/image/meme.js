let request = require("request-promise-native");
let cheerio = require("cheerio");
module.exports = {
  config: {
    name: "meme",
    usage: "meme",
    description: "Show random meme",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    request("https://some-random-api.ml/meme", function(error, response, body) {
      let data = JSON.parse(body);
      console.log(data);
      message.channel.send({
        embed: {
          color: 3447003,
          fields: [
            {
              name: "Caption",
              value: data.caption
            },
            {
              name: "Category",
              value: data.category
            }
          ],
          image: {
            url: data.image
          }
        }
      });
    });
  }
};
