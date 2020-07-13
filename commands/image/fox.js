const request = require('request-promise-native')
const cheerio = require('cheerio')
const req = require('request')
module.exports = {
  config: {
    name: 'fox',
    usage: 'fox',
    description: 'Show random fox image',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    req('https://randomfox.ca/floof/', function (error, response, body) {
      if (error) {
        return message.channel.send({
          embed: {
            color: 15158332,
            title: '__***N I G G E R***__ something went wrong'
          }
        })
      }
      message.channel.send({
        embed: {
          color: 3447003,
          image: {
            url: JSON.parse(body).image
          },
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL({
              format: 'png',
              dynamic: true,
              size: 1024
            })
          }
        }
      })
    })
  }
}
