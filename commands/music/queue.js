let musicModel = require("../../model/model");
let Discord = require("discord.js");
module.exports = {
  config: {
    name: "queue",
    usage: "queue",
    description: "Show current queue songs.",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (!musicModel.queue[0]) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "No songs in queue"
        }
      });
    }
    let songs = musicModel.queue;
    let embed = new Discord.RichEmbed()
      .setColor("#0390fc")
      .setTitle("Songs in queue")
      .setThumbnail(
        client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
      );
    songs.forEach(entry => {
      let requestedBy = "Requested " + entry.requester;
      embed.addField(entry.title, requestedBy);
    });
    message.channel.send(embed);
  }
};
