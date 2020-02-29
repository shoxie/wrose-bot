module.exports = {
  config: {
    name: "Clear",
    usage: "clear [number of messages]",
    description: "Delete specific amount of messages",
    enabled: true
  },
  async run(client, message, args) {
    if (isNaN(args[0])) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "__***YOU THINK I'M A FOOL ?***__",
          description: "Specify the amount !!!"
        }
      });
    }
    if (!isNaN(args[0])) {
      message.channel.bulkDelete(args[0]);
    }
  }
};
