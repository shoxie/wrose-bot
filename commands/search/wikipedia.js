const { MessageEmbed } = require('discord.js')
const { Colors } = require('../../utils/canvas')
const axios = require('axios')
module.exports = {
  config: {
    name: 'wikipedia',
    usage: 'wikipedia',
    aliases: ['wiki'],
    description: 'Search for something on Wikipedia',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const query = args.join(' ')
    if (!query) {
      return Errors.wrongText(
        message,
        'Please provide query to search on Wikipedia'
      )
    }

    axios
      .get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          query
        )}`
      )
      .then((res) => {
        const article = res.data

        if (!article.content_urls) {
          return Errors.resStatus(
            '404',
            message,
            "I couldn't find a wikipedia article with that title!"
          )
        }

        const articleEmbed = new MessageEmbed()
          .setColor(Colors.WIKIPEDIA)
          .setAuthor(
            'Wikipedia Search Engine',
            'https://i.imgur.com/C665mkB.png',
            'https://en.wikipedia.org/'
          )
          .setTitle(article.title)
          .setURL(article.content_urls.desktop.page)
          .setThumbnail(
            article.originalimage ? article.originalimage.source : null
          )
          .setDescription(article.extract)
          .setFooter('Powered by Wikipedia')
          .setTimestamp()

        message.channel.send(articleEmbed)
      })
  }
}
