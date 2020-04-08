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
module.exports = {
  sendSongQueue,
  sendPlaying,
};
