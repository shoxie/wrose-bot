const { stripIndents } = require('common-tags')
const util = require('../../utils/utility')

module.exports = {
  config: {
    name: 'tictactoe',
    usage: 'tictactoe [mention a user]',
    aliases: [],
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const opponent = message.mentions.users.first()
    if (opponent.bot) return message.reply('Bots may not be played against.')
    if (opponent.id === message.author.id) { return message.reply('You may not play against yourself.') }
    const current = client.games.get(message.channel.id)
    if (current) {
      return message.reply(
        `Please wait until the current game of \`${current.name}\` is finished.`
      )
    }
    client.games.set(message.channel.id, { name: this.config.name })
    try {
      await message.channel.send(`${opponent}, do you accept this challenge?`)
      const verification = await util.verify(message.channel, opponent)
      if (!verification) {
        client.games.delete(message.channel.id)
        return message.channel.send('Looks like they declined...')
      }
      const sides = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
      const taken = []
      let userTurn = true
      let winner = null
      while (!winner && taken.length < 9) {
        const user = userTurn ? message.author : opponent
        const sign = userTurn ? 'X' : 'O'
        await message.channel.send(stripIndents`
					${user}, which side do you pick? Type \`end\` to forefeit.
					\`\`\`
					${sides[0]} | ${sides[1]} | ${sides[2]}
					—————————
					${sides[3]} | ${sides[4]} | ${sides[5]}
					—————————
					${sides[6]} | ${sides[7]} | ${sides[8]}
					\`\`\`
				`)
        const filter = res => {
          if (res.author.id !== user.id) return false
          const choice = res.content
          if (choice.toLowerCase() === 'end') return true
          return sides.includes(choice) && !taken.includes(choice)
        }
        const turn = await message.channel.awaitMessages(filter, {
          max: 1,
          time: 30000
        })
        if (!turn.size) {
          await message.channel.send('Sorry, time is up!')
          userTurn = !userTurn
          continue
        }
        const choice = turn.first().content
        if (choice.toLowerCase() === 'end') {
          winner = userTurn ? opponent : message.author
          break
        }
        sides[Number.parseInt(choice, 10) - 1] = sign
        taken.push(choice)
        if (verifyWin(sides)) winner = userTurn ? message.author : opponent
        userTurn = !userTurn
      }
      client.games.delete(message.channel.id)
      return message.channel.send(
        winner ? `Congrats, ${winner}!` : 'Oh... The cat won.'
      )
    } catch (err) {
      client.games.delete(message.channel.id)
      throw err
    }
    function verifyWin (sides) {
      return (
        (sides[0] === sides[1] && sides[0] === sides[2]) ||
        (sides[0] === sides[3] && sides[0] === sides[6]) ||
        (sides[3] === sides[4] && sides[3] === sides[5]) ||
        (sides[1] === sides[4] && sides[1] === sides[7]) ||
        (sides[6] === sides[7] && sides[6] === sides[8]) ||
        (sides[2] === sides[5] && sides[2] === sides[8]) ||
        (sides[0] === sides[4] && sides[0] === sides[8]) ||
        (sides[2] === sides[4] && sides[2] === sides[6])
      )
    }
  }
}
