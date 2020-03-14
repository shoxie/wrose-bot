let util = require("../../utils/utility");
let config = require("../../config/config.json");
module.exports = {
  config: {
    name: "autonews",
    usage: "autonews",
    description: "Enable auto update news from VNEXPRESS",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (message.content.includes("--stop")) {
      clearInterval(newsInterval);
    } else {
      newsInterval = setInterval(async function() {
        await util.sendNews(message);
        util.updateNews();
      }, config.timer);
    }
  }
};
