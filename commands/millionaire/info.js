const Discord = require("discord.js");

module.exports = {
  config: {
    name: "info",
    aliases: [],
    category: "millionaire",
    description: "Info of this game",
    //   usage: '[command]',
    enabled: true,
    ownerOnly: false
  },
  run: async (client, message, args) => {
    let game = message.guild.game;
    let state = game ? game.state : null;
    if (state == null || state == "preInit") {
      message.reply("game not setup yet");
      return;
    }
    let currentQuestion = game.currentQuestion;
    let totalQuestion = game.config.numberQuestions;
    let playersList = game
      .getTopPlayer()
      .map(e => `${e.currentQuestion} ${e.user} ${e.alive ? "✅" : ":x:"}\n`);
    await message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#28f7dc")
        .setTitle("Thông tin")
        .setTimestamp()
        .addField("Câu hỏi hiện tại:", currentQuestion + "/" + totalQuestion)
        .addField("Danh sách người chơi:", playersList)
    );
  }
};
