let request = require("request");
let cheerio = require("cheerio");
let config = require("../config/config.json");
function sendResponse(message) {
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  let query = encodeURIComponent(args.join(" "));
  request(`https://some-random-api.ml/chatbot?message=${query}`, function(
    error,
    response,
    body
  ) {
    if (error) console.log(error);
    let data = JSON.parse(body);
    if (!data) console.log("no data");
    if (data) {
      message.channel.send(data.response);
    }
  });
}
module.exports = {
  sendResponse
};
