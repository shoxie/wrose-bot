let gameModel = require("../../model/warewolf");
let rules = require("../../config/rules.json");
module.exports = {
  config: {
    name: "warewolf",
    usage: "warewolf",
    aliases: [],
    description: "Start a warewolf game [9+ users required]",
    ownerOnly: false,
    enabled: false
  },
  async run(client, message, args) {
    const serverGame = client.warewolf.get(message.guild.id);
    if (serverGame) {
      message.channel.send(
        "Please stop the previous game before you initialize a new game."
      );
    }
    if (!serverGame) {
      let ruleFields = [];
      for (let key in rules) {
        ruleFields.push({ name: key, value: rules[key] });
      }
      let msg = await message.channel.send({
        embed: {
          title: "***WELCOME TO TOWN OF WAREWOLF***",
          color: 3447003,
          description:
            "Please read the rule below, and click ✅ to mark yourself ready.",
          fields: ruleFields
        }
      });
      await msg.react("✅");
      let collected = await message.channel.awaitMessages(
        m =>
          m.author.id === message.author.id &&
          m.content.toLowerCase() === "start",
        {
          max: 1,
          time: 60000
        }
      );
      let user_list = msg.reactions.cache.first().users.cache;
      let players = [];
      for (let user of user_list) {
        if (!user[1].bot) await players.push(user[1]);
      }
      if (players.length === 0) {
        throw message.reply("Stop spamming!");
      } else gameModel.init(client, message, players);
    }
  }
};
