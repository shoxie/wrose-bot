let musicModel = require("../../model/model");
module.exports = {
  config: {
    name: "repeat",
    usage: "repeat",
    description: "Set a playing song on repeat",
    enabled: true
  },
  async run(client, message, args) {
    musicModel.queue.unshift(musicModel.songInfo.video_url);
    message.channel.send({
      embed: {
        color: 3066993,
        title: "Repeating one song",
        description: "Song name " + musicModel.songInfo.title,
        author: {
          name: message.client.user.username,
          icon_url: message.client.user.avatarURL({
            format: "png",
            dynamic: true,
            size: 1024
          })
        }
      }
    });
  }
};
