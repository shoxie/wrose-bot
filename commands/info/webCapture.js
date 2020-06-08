const request = require("request-promise-native");
const fs = require("fs");
const Discord = require("discord.js");
module.exports = {
  config: {
    name: "webCapture",
    usage: "webCapture [website]",
    aliases: [],
    description: "Show capture of a given website",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    message.channel.send(
      "The process may take up to 1 minute to complete. Please wait ..."
    );
    request(
      {
        url:
          "https://api.apiflash.com/v1/urltoimage?full_page=true&scroll_page=true&quality=100&delay=10&format=png",
        encoding: "binary",
        qs: {
          access_key: "2e3e6c58615e4e1b8f42dbca498aedc9",
          url: args[0],
        },
      },
      async (error, response, body) => {
        if (error) {
          console.log(error);
        } else {
          fs.writeFile("screenshot.png", body, "binary", (error) => {
            console.log(error);
          });
          let attachment = new Discord.MessageAttachment("screenshot.png");
          await message.channel.send(attachment);
          await fs.unlink("screenshot.png", (error) => {
            if (error) message.channel.send(error.message);
          });
        }
      }
    );
  },
};
