const request = require("node-superfetch");
module.exports = {
  config: {
    name: "adorable",
    usage: "adorable [text]",
    aliases:[],
    description: "Create adorable text",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    message.channel.send("What text you wanna create ?");
    let collected = await message.channel.awaitMessages(
      m => m.author.id === message.author.id,
      {
        max: 1,
        time: 30000
      }
    );
    try {
      const { body } = await request.get(
        `https://api.adorable.io/avatars/285/${collected}.png`
      );
      return message.channel.send({ files: [{ attachment: body, name: "adorable.png" }] });
    } catch (err) {
      return message.channel.send(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
