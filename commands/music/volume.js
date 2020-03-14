module.exports = {
  config: {
    name: "volume",
    usage: "volume [0-100]",
    description: "Adjust the song volume",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (args[0] < 0 && args[0] > 100 && !Number.isInteger(args[0])) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title:
            "Wrong usage, please read the command usage using __.help volume__",
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
    let volume = args[0] / 100;
    serverQueue.dispatcher.setVolume(volume);
  }
};
