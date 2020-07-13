const stations = require('../../data/stations.json')
const { play, stop, showStations } = require('../../utils/radio')
const { initQueue } = require('../../utils/queue')
const { sendErrorMail } = require('../../utils/utility')
module.exports = {
  config: {
    name: 'radio',
    usage: '[--play] [--stations] [--stop]',
    aliases: [],
    description: 'Start listening to a radio station',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const serverQueue = client.queue.get(message.guild.id)
    if (serverQueue && !serverQueue.radio) { return message.reply('Occupied somewhere else.') }
    try {
      if (args[0] === '--play') {
        const tempQueue = await initQueue(message)
        tempQueue.radio = true
        args.splice(args.indexOf('--play'), 1)
        const name = args.join(' ')
        const station = stations[name]
        if (!station) {
          await tempQueue.voiceChannel.leave()
          client.queue.delete(message.guild.id)
          return message.reply('No such station found')
        } else {
          tempQueue.queue.push(station)
          client.queue.set(message.guild.id, tempQueue)
          play(client, message, station)
        }
      } else if (args[0] === '--stations') {
        showStations(client, message)
      } else if (args[0] === '--stop') {
        stop(client, message)
      }
    } catch (error) {
      sendErrorMail(error)
    }
  }
}
