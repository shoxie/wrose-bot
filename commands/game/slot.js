const { stripIndents } = require('common-tags')
const slots = ['🍇', '🍊', '🍐', '🍒', '🍋']
module.exports = {
  config: {
    name: 'slot',
    usage: 'slot',
    description: 'Play slot game.',
    aliases: [],
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const slotOne = slots[Math.floor(Math.random() * slots.length)]
    const slotTwo = slots[Math.floor(Math.random() * slots.length)]
    const slotThree = slots[Math.floor(Math.random() * slots.length)]
    if (slotOne === slotTwo && slotOne === slotThree) {
      return message.reply(stripIndents`
            ${slotOne}|${slotTwo}|${slotThree}
            Wow! You won! Great job... er... luck!
        `)
    }
    return message.reply(stripIndents`
        ${slotOne}|${slotTwo}|${slotThree}
        Aww... You lost... Guess it's just bad luck, huh?
    `)
  }
}
