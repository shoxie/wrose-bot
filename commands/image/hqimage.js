let request = require("request-promise-native");
let cheerio = require("cheerio");
let rq = require("request");
module.exports = {
  config: {
    name: "hqimage",
    usage: 'hqimage',
    description: "Show random high quality image",
    enabled: true
  },
  async run(client, message, args) {
    let options = {
      method: "GET",
      url: "https://picsum.photos/1920/1080",
      followAllRedirects: true,
      resolveWithFullResponse: true
    };
    var r = request(options.url, function (e, response) {
      //console.log(response.request.uri.Url.href);
    });
    request(options).then(function (body) {
      message.channel.send({
        embed: {
          color: 3447003,
          image: {
            url: r.uri.href
          }
        }
      });
    });
  }
};