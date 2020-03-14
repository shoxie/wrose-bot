module.exports = {
  config: {
    name: "repeat",
    usage: "repeat",
    description: "Set a playing song on repeat",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let serverQueue = client.queue.get(message.guild.id)
    serverQueue.queue.unshift(serverQueue.songInfo.video_url);
    message.channel.send({
      embed: {
        color: 3066993,
        title: "Repeating one song",
        description: "Song name " + serverQueue.songInfo.title,
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
