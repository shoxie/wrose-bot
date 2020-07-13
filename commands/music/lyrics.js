const request = require('request')
const cheerio = require('cheerio')
module.exports = {
  config: {
    name: 'lyrics',
    usage: 'lyrics [song name]',
    description: 'Show lyrics for requested song.',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const query = encodeURIComponent(args.join(' '))
    const msg = await message.channel.send('Searching. . .')
    request(`https://some-random-api.ml/lyrics?title=${query}`, async function (
      error,
      response,
      body
    ) {
      if (error) throw error

      const data = JSON.parse(body)
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
      var output = data.lyrics.split('\n')
      var myfields = []
      var tmp = 0
      var sttmp = ''
      for (var i = 0; i <= output.length; i++) {
        sttmp += output[i] + ' \n '
        tmp++
        if (tmp == 15) {
          myfields.push({ name: '\u200B', value: sttmp })
          tmp = 0
          sttmp = ''
        }
      }
      // if (data.lyrics.length >= 2048) {
      //   var cut = data.lyrics.length - 2000;
      //   data.lyrics = data.lyrics.slice(0, 0 - cut) + "...";
      // }

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
    })

    function geniusLyrics () {
      var replacedString = JSON.stringify(args)
      replacedString = replacedString.replace(/ /g, '%20')
      const options = {
        method: 'GET',
        url: 'https://api.genius.com/search',
        qs: {
          q: replacedString,
          access_token:
            'ZilEYmeGT3qw_4Sfz3qOCnejUa1Jsbvogq55JoCqNw233YpyAUj779BFdgmGv6Wv'
        }
      }
      request(options, function (error, response, body) {
        if (error) {
          return message.channel.send({
            embed: {
              color: 15158332,
              title: '__***Shit***__',
              description: 'Something gone wrong'
            }
          })
        }
        request(url, function (error, reponse, body) {
          const $ = cheerio.load(body)
          const lyrics = $('p')
            .first()
            .eq(0)
            .text()
            .trim()
            .split('\n')
          var myfields = []
          var tmp = 0
          var sttmp = ''
          for (var i = 0; i <= lyrics.length; i++) {
            sttmp += lyrics[i] + ' \n '
            tmp++
            if (tmp == 15) {
              myfields.push({
                name: '------------------------------------------------',
                value: sttmp
              })
              tmp = 0
              sttmp = ''
            }
          }
          message.channel.send({
            embed: {
              color: 3447003,
              fields: myfields
            }
          })
        })
      })
    }
  }
}
