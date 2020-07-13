const { stripIndents } = require('common-tags')
const startWords = require('../../assets/json/word-list')
const util = require('../../utils/utility')
const { redMessage } = require('../../utils/message')
var checkWord = require('spellchecker')
var request = require('request')
module.exports = {
  config: {
    name: 'wordChain',
    usage: 'wordChain',
    description: 'Challenge a user to play word following game.',
    aliases: [],
    ownerOnly: false,
    enabled: true
  },
  async run (client, msg, args) {
    const message = msg
    const time = 10
    const opponent = message.mentions.users.first()

    if (opponent.bot) return msg.reply('Bots may not be played against.')
    if (opponent.id === msg.author.id) { return msg.reply('You may not play against yourself.') }
    const current = client.games.get(msg.channel.id)
    if (current) {
      return msg.reply(
        `Please wait until the current game of \`${current.name}\` is finished.`
      )
    }
    client.games.set(msg.channel.id, { name: this.name })
    try {
      await msg.reply(`${opponent}, do you accept this challenge?`)
      const verification = await util.verify(msg.channel, opponent)
      if (!verification) {
        client.games.delete(msg.channel.id)
        return msg.reply('Looks like they declined...')
      }
      const startWord =
        startWords[Math.floor(Math.random() * startWords.length)]
      await msg.reply(stripIndents`
				The start word will be **${startWord}**! You must answer within **${time}** seconds!
				If you think your opponent has played a word that doesn't exist, respond with **challenge** on your turn.
				Words cannot contain anything but letters. No numbers, spaces, or hyphens may be used.
				The game will start in 5 seconds...
			`)
      await util.delay(5000)
      let userTurn = Boolean(Math.floor(Math.random() * 2))
      const words = []
      let winner = null
      let lastWord = startWord
      while (!winner) {
        const player = userTurn ? msg.author : opponent
        const letter = lastWord.charAt(lastWord.length - 1)
        await msg.channel.send(
          `It's ${player}'s turn! The letter is **${letter}**.`
        )
        const filter = (res) =>
          res.author.id === player.id &&
          /^[a-zA-Z']+$/i.test(res.content) &&
          res.content.length < 50
        const wordChoice = await msg.channel.awaitMessages(filter, {
          max: 1,
          time: time * 1000
        })
        const misspelled = await checkWord.isMisspelled(
          wordChoice.first().content.toLowerCase()
        )
        if (misspelled) {
          await msg.reply('Sorry! You lose!')
          winner = opponent
          break
        }
        if (!wordChoice.size) {
          await msg.reply('Time!')
          winner = userTurn ? opponent : msg.author
          break
        }
        const choice = wordChoice.first().content.toLowerCase()
        if (choice === 'challenge') {
          const checked = await verifyWord(lastWord)
          if (!checked) {
            await msg.reply(`Caught red-handed! **${lastWord}** is not valid!`)
            winner = player
            break
          }
          await msg.reply(`Sorry, **${lastWord}** is indeed valid!`)
          continue
        }
        if (!choice.startsWith(letter) || words.includes(choice)) {
          await msg.reply('Sorry! You lose!')
          winner = userTurn ? opponent : msg.author
          break
        }
        words.push(choice)
        lastWord = choice
        userTurn = !userTurn
      }
      client.games.delete(msg.channel.id)
      if (!winner) return msg.reply('Oh... No one won.')
      msg.channel.send(`The game is over! The winner is ${winner}!`)
      let a = ''
      for (const word of words) {
        a = a + word + ', '
      }
      redMessage(message, 'Game result', a)
    } catch (err) {
      client.games.delete(msg.channel.id)
      throw err
    }
    async function verifyWord (word) {
      if (startWords.includes(word.toLowerCase())) return true
      try {
        const { body } = await request
          .get(
            `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`
          )
          .query({ key: '032fbf78-d658-49c9-afc7-4c6f1d420d15' })
        console.log(body)
        if (!body.length) return false
        return true
      } catch (err) {
        if (err.status === 404) return false
        return null
      }
    }
  }
}
