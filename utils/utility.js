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
function validateUser(message) {
  for (let key in config.ownerID) {
    if (message.member.id === config.ownerID[key]) return true;
  }
  return false;
}
function sendShit(message) {
  message.channel.send(`https://discord.gg/grd5J3K`);
}
module.exports = {
  sendResponse,
  validateUser,
  sendShit
};
