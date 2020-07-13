const { MessageEmbed } = require('discord.js')
const fetch = require('node-fetch')

module.exports = {
  config: {
    name: 'reddit',
    usage: 'reddit [subreddit name]',
    aliases: [],
    description: 'Send top 10 daily posts of a subreddit',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    let subreddit = args[0]
    if (!args[0]) {
      await message.channel.send('Which subreddit ?')
      const collected = await message.channel.awaitMessages(
        (m) => m.author.id === message.author.id,
        {
          max: 1,
          time: 30000
        }
      )
      subreddit = collected.first().content
    }
    await message.channel.send(
      'Do you want to get the top posts from past hour/week/month/year or all?'
    )
    try {
      var t = await message.channel.awaitMessages(
        (msg) =>
          msg.content === 'hour' ||
          msg.content === 'week' ||
          msg.content === 'month' ||
          msg.content === 'year' ||
          msg.content === 'all',
        {
          max: 1,
          maxProcessed: 1,
          time: 60000,
          errors: ['time']
        }
      )
      var timeFilter = t.first().content
    } catch (e) {
      console.error(e)
      return message.channel.send(
        'Please try again and enter a proper time filter'
      )
    }

    fetch(
      `https://www.reddit.com/r/${subreddit}/top/.json?limit=10&t=${
        timeFilter || 'day'
      }`
    )
      .then((res) => res.json())
      .then((json) => {
        const dataArr = json.data.children
        for (let i = 0; i < dataArr.length; i++) {
          message.channel.send(embedPost(dataArr[i].data))
        }
      })
      .catch((err) => {
        message.channel.send('The subreddit you asked for was not found')
        return console.error(err)
      })
    // returns an embed that is ready to be sent
    function embedPost (data) {
      let color = '#FE9004'
      if (data.title.length > 255) {
        data.title = data.title.substring(0, 252) + '...' // discord.js does not allow embed title lengths greater than 256
      }
      if (data.over_18) color = '#cf000f'
      return new MessageEmbed()
        .setColor(color) // if post is nsfw, color is red
        .setTitle(data.title)
        .setURL(`https://www.reddit.com${data.permalink}`)
        .setDescription(`Upvotes: ${data.score} :thumbsup: `)
        .setAuthor(data.author)
        .setImage(data.url)
    }
  }
}
