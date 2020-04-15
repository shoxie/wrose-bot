const sendSongQueue = (message, client) => {
  const serverQueue = client.queue.get(message.guild.id);
  message.channel.send({
    embed: {
      color: 3066993,
      title: "Queue added",
      url: serverQueue.queue[serverQueue.queue.length - 1].url,
      description: serverQueue.queue[serverQueue.queue.length - 1].title,
      thumbnail: {
        url: serverQueue.queue[serverQueue.queue.length - 1].thumbnail,
      },
      footer: {
        text:
          `Duration ` +
          serverQueue.queue[serverQueue.queue.length - 1].duration,
      },
    },
  });
};
const sendPlaying = (message, client) => {
  const serverQueue = client.queue.get(message.guild.id);
  message.channel.send({
    embed: {
      color: 3447003,
      title: "Playing",
      url: serverQueue.queue[0].url,
      description: serverQueue.queue[0].title,
      thumbnail: {
        url: serverQueue.queue[0].thumbnail,
      },
      footer: {
        text: `Duration ` + serverQueue.queue[0].duration,
      },
    },
  });
};
const emptyQueue = (message) => {
  message.channel.send({
    embed: {
      color: 15158332,
      title: "No songs in the queue",
      author: {
        name: message.client.user.username,
        icon_url: message.client.user.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        }),
      },
    },
  });
};
module.exports = {
  sendSongQueue,
  sendPlaying,
  emptyQueue,
};
