const DadJokes = require("dadjokes-wrapper");
const joke = new DadJokes();

module.exports = {
  config: {
    name: "joke",
    usage: "joke",
    description: "Get random joke",
    aliases: [],
    enabled: true,
    ownerOnly: false,
  },
  async run(client, message, args) {
    const dadjoke = await joke.randomJoke();
    message.reply(dadjoke);
  },
};
