module.exports = {
  config: {
    name: "nowPlaying",
    usage: "nowPlaying",
    aliases: ["np"],
    description: "Send information of playing song",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue.queue[0]) {
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
        url: serverQueue.queue[0].url,
        fields: [
          {
            name: "Song name",
            value: serverQueue.queue[0].title
          },
          {
            name: "Duration",
            value: serverQueue.queue[0].duration
          },
          {
            name: "Requested by",
            value: serverQueue.queue[0].requester
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
          url: serverQueue.queue[0].thumbnail
        },
        footer: {
          text: "Created by wrose"
        }
      }
    });
  }
};
