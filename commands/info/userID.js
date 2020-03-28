module.exports = {
  config: {
    name: "userID",
    usage: "userID",
    aliases: [],
    description: "Return user ID",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let user;
    if (!message.mentions.users.first()) user = message.author;
    else user = message.mentions.users.first();
    return message.channel.send(`${user.username}'s ID is ${user.id}.`);
  }
};
