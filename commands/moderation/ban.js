module.exports = {
  config: {
    name: "ban",
    usage: "ban [user] [time] [reason]",
    description: "ban a specific person",
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
    let reason = args[2] ? args[2] : "Not specified";
    let time = parseInt(args[1]);
    user.ban({ days: 7 ? !time : time, reason: reason });
    let bannedUser = await client.users.fetch(user.id);
    message.channel.send({
      embed: {
        color: 15158332,
        title: message.author.tag + " has banned a member from this guild",
        fields: [
          { name: "User", value: bannedUser.username },
          { name: "Reason", value: reason }
        ]
      }
    });
  }
};
