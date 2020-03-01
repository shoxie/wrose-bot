let musicModel = require("../../model/model");
module.exports = {
  config: {
    name: "nowPlaying",
    usage: "nowPlaying",
    description: "Send information of playing song",
    enabled: true
  },
  async run(client, message, args) {
    if (!musicModel.queue[0]) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: "I'm not playing anything right now"
        }
      });
    }
    message.channel.send({
      embed: {
        color: 3447003,
        title: "Now playing",
        url: musicModel.queue[0].url,
        fields: [
          {
            name: "Song name",
            value: musicModel.queue[0].title
          },
          {
            name: "Duration",
            value: musicModel.queue[0].duration
          },
          {
            name: "Requested by",
            value: musicModel.queue[0].requester
          }
        ],
        thumbnail: {
          url: message.client.user.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024
          })
        },
        image: {
          url: musicModel.queue[0].thumbnail
        },
        footer: {
          text: "Created by wrose"
        }
      }
    });
  }
};
