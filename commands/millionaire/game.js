const Discord = require("discord.js");
const questionsModel = require(process.env.NODE_PATH +
  "/model/questionsModel.js");
module.exports = {
  config: {
    name: "game",
    aliases: [],
    category: "millionaire",
    description: "Info of this game and config game",
    usage:
      "[game] \n    [game set category :id] \n    [game set difficulty {easy|medium|hard}] \n    [game set totalQues {0<number<=50}]\n   [game get]",
    enabled: true,
    ownerOnly: false
    },
  run: async (client, message, args) => {
    let config = client.guildSettings.get(message.guild.id).gameConfig;
    if (args.length == 0) {
      return await message.channel.send(
        new Discord.MessageEmbed()
          .addField(
            "Category:",
            `ID:${config.category}| Name:${config.categoryName}`
          )
          .addField("difficulty", config.difficulty ? config.difficulty : "ALL")
          .addField("Total questions", config.numberQuestions)
      );
    }
    if (args[0] == "get") {
      let categorys = await questionsModel.getCategoryDetail();
      let embed = new Discord.MessageEmbed()
        .setTitle("CATEGORY")
        .setColor("RED");
      for (let car of categorys) {
        embed.addField(
          `**${car.id}**.  ${car.name}`,
          `Easy: ${car.category_question_count.total_easy_question_count}
        Medium: ${car.category_question_count.total_medium_question_count}
        Hard: ${car.category_question_count.total_hard_question_count}`,
          true
        );
      }
      return message.channel.send(embed);
    }
    if (args[0] == "set") {
      if (args.length <= 2)
        return message.reply("WHAT THE FUCK IS THE VARIBLE AND VALUE?");
      let varible = args[1].toLowerCase();
      let value = args[2].toLowerCase();
      if (varible == "category") {
        config[varible] = value;
        config.categoryName = await questionsModel.getCategoryName(value);
        if (config.categoryName == "ALL") config[varible] = undefined;
        return message.reply(`Set ${varible} to ${config.categoryName}`);
      }
      if (varible == "difficulty") {
        config[varible] = value;
        if (!["easy", "medium", "hard"].includes(value)) {
          config[varible] = undefined;
        }
        return message.reply(
          `Set ${varible} to ${config.difficulty ? config.difficulty : "ALL"}`
        );
      }
      if (varible == "totalques") {
        if (value > 0 && value <= 50) {
          config.numberQuestions = value;
          return message.reply(`Set Total questions to ${config[varible]}`);
        }
      }
    }
  },
};
