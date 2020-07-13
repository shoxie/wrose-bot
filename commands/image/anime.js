const fetch = require('node-fetch')
module.exports = {
  config: {
    name: 'anime',
    usage: 'anime',
    description: 'Show random anime gif',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    fetch(
      `https://api.tenor.com/v1/random?key=${process.env.tenorAPI}&q=anime&limit=1`
    )
      .then((res) => res.json())
      .then((json) => message.channel.send(json.results[0].url))
      .catch((e) => {
        message.channel.send('Failed to find a gif :slight_frown:')
        // console.error(e);
      })
  }
}
