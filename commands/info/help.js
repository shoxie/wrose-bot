let fs = require("fs");
let noob = require("../music/playlist");
let conf = require("../../config/config.json");
module.exports = {
  config: {
    name: "help",
    usage: "help [command name]",
    aliases: ["h", "help"],
    description:
      "Show helps for commands, use ```.commands``` for the list of commands",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (!args[0]) {
      message.channel.send({
        embed: {
          color: 3447003,
          title: "This is the property of wrose",
          description: "Honestly it's a bot made by wrose",
          fields: [
            {
              name: "Prefix",
              value: conf.prefix
            },
            {
              name: "Running in ",
              value: client.guilds.cache.size + " servers"
            }
          ],
          thumbnail: {
            url: client.user.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024
            })
          }
        }
      });
    }
    let usage = `${conf.prefix}` + client.commands.get(args[0]).config.usage;
    if (args[0]) {
      message.channel.send({
        embed: {
          color: 3447003,
          fields: [
            {
              name: "Name",
              value: client.commands.get(args[0]).config.name
            },
            {
              name: "Usage",
              value: usage
            },
            {
              name: "Description",
              value: client.commands.get(args[0]).config.description
            }
          ],
          thumbnail: {
            url: message.client.user.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024
            })
          }
        }
      });
    }
  }
};
