const request = require('request')
const cheerio = require('cheerio')
const { getLyrics } = require('../../utils/radio')
const radio = require('../../utils/radio')
module.exports = {
  config: {
    name: 'lyrics',
    usage: 'lyrics [song name]',
    aliases: ['ly'],
    description: 'Show lyrics for requested song.',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id)
    const query = encodeURIComponent(args.join(' '))
    let bool = false
    if (!args[0] && !serverQueue) {
      for (const actv of message.author.presence.activities) {
        if (actv.name === 'Spotify') {
          const key = encodeURIComponent(actv.details)
          const [data, myfields] = await getLyrics(key)
          sendMsg(data, myfields)
          bool = true
          return
        }
      }
    }
    if (!args[0] && serverQueue) {
      const key = encodeURIComponent(serverQueue.queue[0].title)
      const [data, myfields] = await getLyrics(key)
      bool = true
      sendMsg(data, myfields)
      return
    }
    if (bool === false) {
      return message.channel.send(
        'Neither you are not listening to anything nor im not playing any music'
      )
    }
    const msg = await message.channel.send('Searching. . .')

    const [data, myfields] = await getLyrics(query)
    if (data.error) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "I can't find that song. Using another engine"
        }
      })
      await geniusLyrics()
      return
    }
    sendMsg(data, myfields)
    function sendMsg (data, myfields) {
      message.channel.send({
        embed: {
          color: 3447003,
          title: 'Lyrics for requested song',
          url: data.links.genius,
          // description: data.lyrics,
          fields: myfields,
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL({
              format: 'png',
              dynamic: true,
              size: 1024
            })
          }
          // timestamp: new Date(), useless shit
        }
      })
      message.channel.send({
        embed: {
          color: 3447003,
          title: 'Information of requested song',
          url: data.links.genius,
          fields: [
            {
              name: 'Song name',
              value: data.title
            },
            {
              name: 'Author',
              value: data.author
            }
          ],
          image: {
            url: data.thumbnail.genius
          },
          footer: {
            text: 'Powered by Genius\t\t\t\tCreated by wrose',
            icon_url:
              'https://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png'
          },
          thumbnail: {
            url: client.user.avatarURL({
              format: 'png',
              dynamic: true,
              size: 1024
            })
          }
        }
      })
    }
  }
}
