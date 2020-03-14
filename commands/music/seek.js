module.exports = {
  config: {
    name: "seek",
    usage: "seek [time]",
    description: "Resume song at specific time",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    console.log(message.member.voice.channel.id, serverQueue.voiceChannel.id);

    if (!message.member.voice.channel)
      return message.channel.send("Join voice channel first");
    if (!serverQueue) return message.channel.send("No songs to seek");
    if (serverQueue.voiceChannel.id !== message.member.voice.channel.id) {
      message.chanel.send(
        `You must in **${serverQueue.voiceChannel.name}** to seek the song`
      );
    } else {
      serverQueue.dispatcher.end(`seek 02:38`);
    }
  }
};
