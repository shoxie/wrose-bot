module.exports = {
  config: {
    name: "moveMembers",
    usage: "moveMembers [source] [destination]",
    description: "Move all members from one channel to another",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    //  let role = message.guild.roles.find(x => x.name === "")
    if (!message.member.hasPermission("ADMINISTRATOR")) return;
    let voiceChannelOriginal = message.member.guild.channels.cache.find(
      x => x.id === args[0]
    );
    let destination = message.member.guild.channels.cache.find(
      x => x.id === args[1]
    );
    if (voiceChannelOriginal && destination) {
      voiceChannelOriginal.members.forEach(function(member, id) {
        member.voice.setChannel(args[1]);
      });
    }
  }
};
