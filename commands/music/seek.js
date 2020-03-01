let musicModel = require("../../model/model");
module.exports = {
  config: {
    name: "seek",
    usage: "seek [time]",
    description: "Resume song at specific time",
    enabled: false
  },
  async run(client, message, args) {
    if (!args[0]) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "__***YOU THINK I'M A FOOL?***__",
          description: "Input a text",
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
    } else {
      musicModel.dispatcher.seek(args[0]);
    }
  }
};
