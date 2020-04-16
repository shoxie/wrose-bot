module.exports = (client) => {
  return async function (oldState, newState) {
    const serverQueue = client.queue.get(newState.guild.id);
    if (!serverQueue) return;
    if (serverQueue) {
      if (serverQueue.voiceChannel.members.size < 2) {
        setTimeout(() => {
          serverQueue.queue = [];
          serverQueue.textChannel.send("Tao đã chờ ở đây quá lâu rồi!");
          if (serverQueue.radio) serverQueue.dispatcher.destroy();
          else serverQueue.connection.dispatcher.end();
        }, 10000);
      }
    }
  };
};
