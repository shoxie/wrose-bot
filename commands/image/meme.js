const request = require('request-promise-native')
const { tryAgain } = require('../../utils/message')
module.exports = {
  config: {
    name: 'meme',
    usage: 'meme',
    description: 'Show random meme',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    request('https://some-random-api.ml/meme', function (error, response, body) {
      if (!body) return tryAgain(message)
      const data = JSON.parse(body)
      message.channel.send({
        embed: {
          color: 3447003,
          fields: [
            {
              name: 'Caption',
              value: data.caption
            },
            {
              name: 'Category',
              value: data.category
            }
          ],
          image: {
            url: data.image
          }
        }
      })
    })
  }
}
