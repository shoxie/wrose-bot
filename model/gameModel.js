const Discord = require("discord.js");
const questionsModel = require("./questionsModel.js");

class Game {
  constructor(config) {
    this.config = {
      category: undefined,
      categoryName: "ALL",
      difficulty: "easy",
      numberQuestions: 15
    };
    Object.assign(this.config, config);
  }

  async init(players) {
    if (players.length == 0) return;
    this.state = "init";
    this.currentQuestion = 1;
    this.players = new Discord.Collection();
    for (let user of players) {
      this.players.set(user.id, {
        user,
        alive: true,
        currentQuestion: 1
      });
    }
    this.questions = await questionsModel.getQuestions(this.config);
  }
  getTopPlayer() {
    this.players.sort((a, b) => b.currentQuestion - a.currentQuestion);
    return this.players;
  }
  async _end() {
    this.state = "end";
    let embed = getEndEmbed(this.getTopPlayer());
    this.message.channel.send(embed);
  }
  async _play(index) {
    if (index > this.config.numberQuestions) return _end();
    let editEmbed = new Discord.MessageEmbed().setTitle(
      `:computer: LOADING QUESTION....`
    );
    const msg = await this.message.channel.send(editEmbed);
    await msg.react("🇦");
    await msg.react("🇧");
    await msg.react("🇨");
    await msg.react("🇩");

    let question = this.questions[index];
    let answer = question.answer;
    editEmbed = new Discord.MessageEmbed()
      .setColor("#53b512")
      .setTitle("Câu hỏi số " + index)
      .setTimestamp()
      .setFooter(
        "Ai la trieu phu",
        "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
      )
      .setDescription(question.question)
      .addField("Đáp án 🇦", question.A, true)
      .addField("Đáp án 🇧", question.B, true)
      .addField("\u200B", "\u200B")
      .addField("Đáp án 🇨", question.C, true)
      .addField("Đáp án 🇩", question.D, true);

    await msg.edit(editEmbed);

    let interval;
    let time = 30;
    let cdMsg = await this.message.channel.send(`Time left: ${time} seconds`);
    interval = setInterval(function() {
      cdMsg.edit(`Time left: ${time} seconds`);
      time--;
      if (time < 0) {
        cdMsg.delete();
        clearInterval(interval);
      }
    }, 1000);
    //reset all voted
    this.players.forEach(function(player) {
      player.voted = null;
    });

    const filter = (reaction, user) => {
      let player = this.players.get(user.id);
      if (user.bot || (player && (player.voted || !player.alive)) || !player)
        return false;
      if (!["🇦", "🇧", "🇨", "🇩"].includes(reaction.emoji.name)) return false;
      player.voted = reaction.emoji.name;
      this.message.channel.send(`${user} voted ${reaction.emoji.name}`);
      return true;
    };

    await msg.awaitReactions(filter, { time: time * 1000 });

    this.players.forEach(function(player) {
      if (!player.alive) return;
      let userAnswer = player.voted;
      player.currentQuestion = index;
      switch (userAnswer) {
        case "🇦":
          userAnswer = "A";
          break;
        case "🇧":
          userAnswer = "B";
          break;
        case "🇨":
          userAnswer = "C";
          break;
        case "🇩":
          userAnswer = "D";
          break;
        default:
          userAnswer = null;
      }
      if (userAnswer != answer) player.alive = false;
    });
    let alivePlayers = this.players.filter(player => player.alive);
    let embed = getAnswerEmbed(answer);
    let answerMsg = await this.message.channel.send(embed);
    setTimeout(function() {
      msg.edit(
        new Discord.MessageEmbed()
          .setTitle(`Question ${index} has been hidden :V`)
          .setColor("NAVY")
      );
      answerMsg.delete();
    }, 10000);
    await this.message.channel.send(
      new Discord.MessageEmbed()
        .setColor("#0099ff")
        .setTitle("Người chơi tiếp: " + alivePlayers.size)
        .setTimestamp()
        .setFooter(
          "Ai la trieu phu",
          "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
        )
        .addField(
          "Danh sách",
          alivePlayers.size > 0
            ? alivePlayers.map(e => e.user).join("\n")
            : "Đéo có ai :'("
        )
    );
    setTimeout(() => {
      if (alivePlayers.size == 0) this._end();
      else this._play(index + 1);
    }, 4000);
  }

  async play(message) {
    this.message = message;
    this.state = "playing";
    this._play(1);
  }
}
module.exports = Game;

function getAnswerEmbed(answer) {
  const imgFile = new Discord.MessageAttachment("./image/" + answer + ".png");
  return new Discord.MessageEmbed()
    .setColor("#a3ff99")
    .setTitle("Câu trả lời của chúng tôi là")
    .setTimestamp()
    .setFooter(
      "Ai la trieu phu",
      "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
    )
    .attachFiles(imgFile)
    .setImage("attachment://" + answer + ".png");
}
function getEndEmbed(playerList) {
  playerList = [...playerList.values()];
  const emojis = [0, 0, 0];
  for (let i of playerList) emojis.push(":poop:");
  emojis[0] = ":first_place:";
  emojis[1] = ":second_place:";
  emojis[2] = ":third_place:";
  playerList = playerList.map(
    (elem, index) => `${emojis[index]} ${elem.user} ${elem.currentQuestion} `
  );
  return new Discord.MessageEmbed()
    .setColor("#dbdb2c")
    .setTitle("END GAME")
    .setTimestamp()
    .setFooter(
      "Ai la trieu phu",
      "https://upload.wikimedia.org/wikipedia/en/f/fe/Vietnam_millionaire.JPG"
    )
    .addField("Rank: ", playerList.join(" \n "));
}
