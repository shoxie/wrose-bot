let request = require("request-promise-native");
let cheerio = require("cheerio");
module.exports = {
  config: {
    name: "cat",
    usage: "cat",
    description: "Show random cat image",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let fact = await request(
      "https://some-random-api.ml/facts/cat",
      async function(error, response, body) {
        let data = await JSON.parse(body);
        return data;
      }
    );
    let options = {
      method: "HEAD",
      url: "https://thecatapi.com/api/images/get",
      followAllRedirects: true,
      resolveWithFullResponse: true
    };
    var r = request(options.url, function(e, response) {
      //console.log(response.request.uri.Url.href);
    });
    if (message.content.includes("--fact")) {
      request(options).then(function(body) {
        message.channel.send({
          embed: {
            color: 3447003,
            fields: [{ name: "Fact", value: JSON.parse(fact).fact }],
            image: {
              url: r.uri.href
            },
            author: {
              name: message.client.user.username,
              icon_url: message.client.user.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024
              })
            }
          }
        });
      });
    } else {
      request(options).then(function(body) {
        message.channel.send({
          embed: {
            color: 3447003,
            image: {
              url: r.uri.href
            },
            author: {
              name: message.client.user.username,
              icon_url: message.client.user.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024
              })
            }
          }
        });
      });
    }
  }
};
