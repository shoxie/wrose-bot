module.exports = {
  config: {
    name: "flight",
    usage: "flight ",
    description: "Bring a user on a server tour",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    let blacklistArray = ["155622262660268033"];

    let mention = message.mentions.users.first();
    for (let id of blacklistArray) {
      if (mention.id === id)
        return message.reply("Doctor said: Fuck you bicc boi");
    }
    let user = message.guild.members.cache.get(mention.id);
    const channels = message.guild.channels.cache.filter(
      (c) => c.type === "voice"
    );
    let original = user.voice.channel.id;
    for (const [channelID, channel] of channels) {
      user.voice
        .setChannel(channelID)
        .then(() => console.log(`Moved ${user.user.tag}.`))
        .catch(console.error);
    }
    user.voice.setChannel(original);
  },
};
