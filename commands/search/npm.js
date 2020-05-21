let request = require("request-promise-native");
const { blueMessage, redMessage } = require("../../utils/message");
const Discord = require("discord.js");
module.exports = {
  config: {
    name: "npm",
    usage: "npm",
    aliases: [],
    description: "Search for a package on npm",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    if (!args)
      return redMessage(message, "Error", "Get me something to search for");
    request(
      `https://api.npms.io/v2/search?q=` + encodeURIComponent(args.join(" ")),
      async function (error, response, body) {
        let data = JSON.parse(body);
        let embeds = [],
          i = 0;
        data.results.forEach((package) => {
          let name = package.package.name;
          let description = package.package.description;
          let d = {
            i: i,
            name: name,
            description: description,
          };
          embeds.push(d);
          i++;
        });
        let embed = new Discord.MessageEmbed()
          .setColor("#0390fc")
          .setTitle("Top requested song my storage")
          .setThumbnail(
            client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
          );
        data.results.forEach((entry) => {
          embed.addField(entry.package.name, entry.package.description);
        });
        message.channel.send(embed);
        await message.channel.send("Which package");
        let collected = await message.channel.awaitMessages(
          (m) => m.author.id === message.author.id,
          {
            max: 1,
            time: 30000,
          }
        );
        let position = collected.first().content;
        // if (!parseInt(position))
        //   return redMessage(
        //     message,
        //     "Wrong usage",
        //     "Please re-call the command"
        //   );
        let target = data.results[parseInt(position - 1)];
        message.channel.send({
          embed: {
            title: "Information for the package",
            color: 3447003,
            fields: [
              {
                name: "Package name",
                value: target.package.name,
              },
              {
                name: "Package description",
                value: target.package.description,
              },
              {
                name: "Package version",
                value: target.package.version,
              },
              {
                name: "NPM link",
                value: target.package.links.npm,
              },
              {
                name: "Homepage link",
                value: target.package.links.homepage,
              },
              {
                name: "Repository link",
                value: target.package.links.repository,
              },
              {
                name: "Final Score",
                value: target.score.final,
              },
              {
                name: "Quality Score",
                value: target.score.detail.quality,
              },
              {
                name: "Popularity: Score",
                value: target.score.detail.popularity,
              },
              {
                name: "Maintenance: Score",
                value: target.score.detail.maintenance,
              },
              {
                name: "Search Score",
                value: target.searchScore,
              },
            ],
            thumbnail: {
              url: client.user.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              }),
            },
          },
        });
      }
    );
  },
};
