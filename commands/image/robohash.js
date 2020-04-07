const request = require("node-superfetch");
module.exports = {
  config: {
    name: "roboHash",
    usage: "roboHash",
    aliases: [],
    description: "idk",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    message.channel.send("Input a text to create random robo");
    let collected = await message.channel.awaitMessages(
      m => m.author.id === message.author.id,
      {
        max: 1,
        time: 30000
      }
    );
    let text = collected.first().content;
    try {
      const { body } = await request.get(`https://robohash.org/${text}`);
      return message.channel.send({ files: [{ attachment: body, name: "robohash.png" }] });
    } catch (err) {
      return message.reply(
        `Oh no, an error occurred: \`${err.message}\`. Try again later!`
      );
    }
  }
};
