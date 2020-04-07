const Discord = require("discord.js");
const questionsModel = require(process.env.NODE_PATH +
  "/model/questionsModel.js");
const Game = require(process.env.NODE_PATH + "/model/gameModel.js");
module.exports = {
  config: {
    name: "start",
    aliases: [],
    category: "millionaire",
    description: "Start the game",
    enabled: true,
    ownerOnly: false,
  },
  run: async (client, message, args) => {
    try {
      let game = message.guild.game;
      if (game && (game.state === "playing" || game.state === "preInit"))
        return message.reply("ANOTHER GAME IS PLAYING!!!!");
      await setup(client, message);
      game = message.guild.game;
      game.play(message);
    } catch (e) {
      console.log(e);
      return e;
    }
  },
};

async function setup(client, message) {
  //checkAPI
  let checkDb = await questionsModel.checkDb();
  if (!checkDb) {
    throw message.channel.send("QUESTION API ERRORS,CANT PLAY NOW");
  }
  //game Object
  if (!message.guild.game || message.guild.game.state !== "playing") {
    let config = client.guildSettings.get(message.guild.id).gameConfig;
    message.guild.game = new Game(config);
  }
  let game = message.guild.game;
  game.state = "preInit";
  if (game.state === "playing") {
    throw message.reply("ANOTHER GAME IS PLAYING!!!!");
  }

  let config = game.config;
  const embed = new Discord.MessageEmbed()
    .setColor("#a3b5a5")
    .setTitle('Ai là thằng lú <(")')
    .addField("Category", config.categoryName)
    .addField("Difficulty", config.difficulty, true)
    .addField("Number Of Questions", config.numberQuestions, true)
    .setThumbnail(
      "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
    )
    .setDescription("✅ To Play")
    .setTimestamp()
    .setFooter(
      "Ai là thằng lú",
      "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
    )
    .addField("Command", 'type "confirm" if you ready!');
  const msg = await message.channel.send(embed);
  await msg.react("✅");

  let collected = await message.channel.awaitMessages(
    (m) =>
      m.author.id === message.author.id &&
      m.content.toLowerCase() === "confirm",
    {
      max: 1,
      time: 60000,
    }
  );
  let user_list = msg.reactions.cache.first().users.cache;
  let players = [];
  for (let user of user_list) {
    if (!user[1].bot) players.push(user[1]);
  }
  if (players.length === 0) {
    throw message.reply("No one want to play :((");
  }
  await game.init(players);
  if (game.questions.length == 0)
    return "SOMETHING ERRORS WITH THE QUESTIONS :) PLEASE CHANGE ";
  const embed2 = new Discord.MessageEmbed()
    .setColor("#a3b5a5")
    .setTitle('Ai là triệu phú <(")')
    .setThumbnail(
      "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
    )
    .setTimestamp()
    .setFooter(
      "Ai la trieu phu",
      "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
    )
    .addField("Players:", players.join("\n"));
  message.channel.send(embed2);
}
