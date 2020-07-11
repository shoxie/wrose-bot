const music = require("../../model/musicData");
const Discord = require("discord.js");
const Pagination = require("discord-paginationembed");
module.exports = {
  config: {
    name: "topSongs",
    usage: "topSongs",
    description: "Show top songs played. Use --server to show guild stats",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    // let global = await music.getSongs();
    // let
    let songs = args.includes("--server")
      ? await music.guildTop(message.guild.id)
      : await music.getSongs();
    console.log(await music.guildTop(message.guild.id));
    if (songs) {
      let embed = new Discord.MessageEmbed()
        .setColor("#0390fc")
        .setTitle("Top requested song my storage")
        .setThumbnail(
          client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
        );
      songs.forEach((entry) => {
        embed.addField(entry.name, entry.count);
      });
      message.channel.send(embed);
      // sendPage(songs)
    }
    if (!songs) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "My storage is empty",
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
    async function sendPage(songs) {
      let embeds = [];
      songs.forEach((entry) => {
        let data = {
          name: entry.name,
          count: entry.count,
        };
        embeds.push(data);
      });
      let msg = new Pagination.FieldsEmbed()
        .setArray(embeds)
        .setAuthorizedUsers([])
        .setChannel(message.channel)
        .setPageIndicator(true)
        .formatField(`Name`, (i) => i.name)
        .formatField("Count", (i) => i.count, true)
        .setElementsPerPage(5)
        .setDeleteOnTimeout(true)
        .setEmojisFunctionAfterNavigation(true);
      msg.embed
        .setThumbnail(
          client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
        )
        .setColor("#0390fc")
        .setFooter("Created by wrose");
      await msg.build();
    }
  },
};
