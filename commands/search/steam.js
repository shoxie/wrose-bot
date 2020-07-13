const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const IMDB = require('imdb-api')
const { Colors } = require('../../utils/canvas')
const { redMessage } = require('../../utils/message')
const { stripIndents } = require('common-tags')
const axios = require('axios')
const { formatNumber } = require('../../utils/utility')
module.exports = {
  config: {
    name: 'steam',
    usage: 'steam',
    aliases: [],
    description: 'Search for Steam games',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const query = args.join(' ')
    if (!query) {
      return redMessage(message, 'noQuery')
    }

    const headers = {
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36'
    }
    const data = await axios
      .get(
        `https://store.steampowered.com/api/storesearch/?term=${query}&l=en&cc=us`,
        { headers }
      )
      .then((res) => res.data)
    if (!data.items.length) {
      return redMessage(message, 'invalidQuery')
    }

    const ids = data.items[0].id
    const details = await axios
      .get(`https://store.steampowered.com/api/appdetails?appids=${ids}`, {
        headers
      })
      .then((res) => res.data[ids].data)

    const price = details.price_overview
      ? details.price_overview.final_formatted
      : '$0'
    const platforms = []
    if (details.platforms) {
      if (details.platforms.windows) platforms.push('Windows')
      if (details.platforms.mac) platforms.push('Mac')
      if (details.platforms.linux) platforms.push('Linux')
    }

    const steamEmbed = new MessageEmbed()
      .setColor(Colors.STEAM)
      .setAuthor(
        'Steam Store Search Engine',
        'https://i.imgur.com/xxr2UBZ.png',
        'http://store.steampowered.com/'
      )
      .setTitle(details.name)
      .setURL(`https://store.steampowered.com/app/${details.steam_appid}/`)
      .setImage(details.header_image)
      .setDescription(details.short_description)
      .addField(
        '__**Details**__',
        stripIndents`
            _Release Date:_ **${
              details.release_date ? details.release_date.date : 'Coming Soon'
            }**
            _Price:_ **${price}**
            _Genres:_ **${details.genres.map((g) => g.description).join(', ')}**
            _Platform:_ **${platforms.join(', ') || 'None'}**
            _Achievements:_ **${
              details.achievements
                ? formatNumber(details.achievements.total)
                : 0
            }**
            _DLC Count:_ **${
              details.dlc ? formatNumber(details.dlc.length) : 0
            }**
            _Recommendations:_ **${
              details.recommendations
                ? formatNumber(details.recommendations.total)
                : 'None'
            }**
            _Publishers:_ **${details.publishers.join(', ')}**
            _Developers:_ **${details.developers.join(', ')}**
            _Website:_ **${details.website ? details.website : 'None'}**
            _Support:_ **${
              details.support_info
                ? details.support_info.url
                : details.support_info.email || 'None'
            }**`
      )
      .setFooter('Powered by Steam Store')
      .setTimestamp()

    message.channel.send(steamEmbed)
  }
}
