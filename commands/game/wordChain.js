const { stripIndents } = require("common-tags");
const startWords = require("../../assets/json/word-list");
const util = require("../../utils/utility");
const { redMessage } = require("../../utils/message");
var checkWord = require("check-word");
var check = checkWord("en");
module.exports = {
  config: {
    name: "wordChain",
    usage: "wordChain",
    description: "Challenge a user to play word following game.",
    aliases: [],
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    let time = 10;
    const opponent = message.mentions.users.first();
    if (opponent.bot) return message.reply("Bots may not be played against.");
    if (opponent.id === message.author.id)
      return message.reply("You may not play against yourself.");
    const current = client.games.get(message.channel.id);
    if (current)
      return message.reply(
        `Please wait until the current game of \`${current.name}\` is finished.`
      );
    client.games.set(message.channel.id, { name: this.config.name });
    try {
      await message.channel.send(`${opponent}, do you accept this challenge?`);
      const verification = await util.verify(message.channel, opponent);
      if (!verification) {
        client.games.delete(message.channel.id);
        return message.channel.send("Looks like they declined...");
      }
      const startWord =
        startWords[Math.floor(Math.random() * startWords.length)];
      await message.channel.send(stripIndents`
				The start word will be **${startWord}**! You must answer within **${time}** seconds!
				If you think your opponent has played a word that doesn't exist, respond with **challenge** on your turn.
				Words cannot contain anything but letters. No numbers, spaces, or hyphens may be used.
				The game will start in 5 seconds...
			`);
      await util.delay(5000);
      let userTurn = Boolean(Math.floor(Math.random() * 2));
      const words = [];
      let winner = null;
      let lastWord = startWord;
      while (!winner) {
        const player = userTurn ? message.author : opponent;
        const letter = lastWord.charAt(lastWord.length - 1);
        await message.channel.send(
          `It's ${player}'s turn! The letter is **${letter}**.`
        );
        const filter = (res) =>
          res.author.id === player.id &&
          /^[a-zA-Z']+$/i.test(res.content) &&
          res.content.length < 50;
        const wordChoice = await message.channel.awaitMessages(filter, {
          max: 1,
          time: time * 1000,
        });
        if (!wordChoice.size) {
          await message.channel.send("Time!");
          winner = userTurn ? opponent : message.author;
          break;
        }
        const choice = wordChoice.first().content.toLowerCase();
        if (choice) {
          if (!check.check(choice)) {
            await message.channel.send(
              `Caught red-handed! **${lastWord}** is not valid!`
            );
            winner = userTurn ? opponent : message.author;
            break;
          }
          await message.channel.send(`Sorry, **${choice}** is indeed valid!`);
          continue;
        }
        if (!choice.startsWith(letter) || words.includes(choice)) {
          await message.channel.send("Sorry! You lose!");
          winner = userTurn ? opponent : message.author;
          break;
        }
        words.push(choice);
        lastWord = choice;
        userTurn = !userTurn;
      }
      client.games.delete(message.channel.id);
      if (!winner) return message.channel.send("Oh... No one won.");
      let a = "";
      for (let word of words) {
        a = a + word + ", ";
      }
      redMessage(message, "Game result", a);
      return message.channel.send(
        `The game is over! The winner is ${winner}! \n ${words.length} was answered`
      );
    } catch (err) {
      client.games.delete(message.channel.id);
      throw err;
    }
  },
};
