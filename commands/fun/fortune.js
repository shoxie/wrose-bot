const fetch = require('node-fetch')
const { MessageEmbed } = require('discord.js')
module.exports = {
  config: {
    name: 'fortune',
    usage: 'fortune',
    aliases: [],
    description: 'Send random fortune text',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    try {
      const res = await fetch('http://yerkee.com/api/fortune')
      const json = await res.json()
      const embed = new MessageEmbed()
        .setColor('RANDOM')
        .setTitle('Fortune Cookie')
        .setDescription(json.fortune)
      return message.channel.send(embed)
    } catch (e) {
      message.channel.send('Could not obtain fortune cookie :confused: ')
      return console.error(e)
    }
  }
}
