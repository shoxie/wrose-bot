module.exports = {
  config: {
    name: "kick",
    usage: "kick [user] [reason]",
    description: "Kick a specific person",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let user = await message.mentions.members.first();
    if (!user) {
      message.channel.send({
        embed: {
          title: "__***PICK A USER FOOL***__",
          color: 15158332
        }
      });
    }
    let reason = args[1] ? args[1] : "Not specified";
    user.kick(reason);
    let kickedUser = await client.users.fetch(user.id);
    message.channel.send({
      embed: {
        color: 15158332,
        title: message.author.tag + " has removed a member from this guild",
        fields: [
          { name: "User", value: kickedUser.username },
          { name: "Reason", value: reason }
        ]
      }
    });
  }
};
