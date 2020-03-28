module.exports = {
  config: {
    name: "clear",
    usage: "clear [number of messages]",
    description: "Delete specific amount of messages",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (isNaN(args[0])) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "__***YOU THINK I'M A FOOL ?***__",
          description: "Specify the amount !!!",
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024
            })
          }
        }
      });
    }
    if (!isNaN(args[0])) {
      message.channel.bulkDelete(args[0]);
    }
  }
};
