let request = require("request-promise-native");
let cheerio = require("cheerio");
module.exports = {
  config: {
    name: "shiba",
    usage: "shiba",
    description: "Show random shiba image",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    request("http://shibe.online/api/shibes", function(error, response, body) {
      if (error) {
        return message.channel.send({
          embed: {
            color: 15158332,
            title: "__***N I G G E R***__ something went wrong"
          }
        });
      }
        message.channel.send({
          embed: {
            color: 3447003,
            image: {
              url: JSON.parse(body)[0]
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
};
