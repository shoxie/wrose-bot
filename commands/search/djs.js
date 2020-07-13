const axios = require('axios')
module.exports = {
  config: {
    name: 'djs',
    usage: 'djs',
    aliases: [],
    description: 'Search for something on discord.js documents',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const query = args.join(' ')

    axios.get(`https://djsdocs.sorta.moe/v2/embed?src=stable&q=${encodeURIComponent(query)}`).then((res) => {
      const embed = res.data

      if (embed && !embed.error) {
        message.channel.send({ embed })
      } else {
        message.reply(`I don't know mate, but "${query}" doesn't make any sense!`)
      }
    }).catch(() => {
      message.reply('Darn it! I failed!')
    })
  }
}
