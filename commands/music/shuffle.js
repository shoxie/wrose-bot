const { emptyQueue } = require('../../utils/message')
const { shuffleArray } = require('../../utils/utility')
module.exports = {
  config: {
    name: 'shuffle',
    usage: 'shuffle',
    aliases: [],
    description: 'Shuffle current music queue',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const normaldj = message.guild.roles.cache.find((x) => x.name === 'dj')
    const bigdj = message.guild.roles.cache.find((x) => x.name === 'DJ')
    const roleID = bigdj || normaldj
    const serverQueue = client.queue.get(message.guild.id)
    if (!serverQueue) {
      console.log(serverQueue)
      return emptyQueue(message)
    }
    if (message.member.roles.cache.has(roleID.id)) {
      if (message.member.voice.channel != serverQueue.voiceChannel) {
        // undefined
        return message.channel.send({
          embed: {
            title:
              'You have to be in the same channel with the me to use the command',
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
      } else {
        let queue = serverQueue.queue
        const temp = queue[0]
        queue.shift()
        queue = shuffleArray(queue)
        queue.unshift(temp)
        message.channel.send('Queue shuffled')
      }
    } else {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: 'You do not have the DJ role.'
        }
      })
    }
  }
}
