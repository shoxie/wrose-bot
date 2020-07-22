const request = require("request-promise-native");
const { tryAgain } = require("../../utils/message");
module.exports = {
  config: {
    name: "wink",
    usage: "wink",
    aliases: [],
    description: "Send a winking anime gif",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    request("https://some-random-api.ml/animu/wink", function (
      error,
      response,
      body
    ) {
      if (!body) return tryAgain(message);
      const data = JSON.parse(body);
      message.channel.send(data.link);
    });
  },
};
