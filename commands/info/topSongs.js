const music = require("../../model/musicData");
const Discord = require("discord.js");
module.exports = {
  config: {
    name: "topSongs",
    usage: "topSongs",
    description: "Show top songs played by me",
    enabled: true
  },
  async run(client, message, args) {
    let songs = await music.getSongs();
    if (songs) {
      let embed = new Discord.RichEmbed()
        .setColor("#0390fc")
        .setTitle("Top requested song my storage")
        .setThumbnail(
          client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
        );
      songs.forEach(entry => {
        embed.addField(entry.name, entry.count);
      });
      message.channel.send(embed);
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
              size: 1024
            })
          }
        }
      });
    }
  }
};
