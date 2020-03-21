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
              value: client.guildSettings.get(message.guild.id).prefix
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
    if (args[0]) {
      let usage =
        `${client.guildSettings.get(message.guild.id).prefix}` +
        client.commands.get(args[0]).config.usage;
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
