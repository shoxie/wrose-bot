const util = require('../../utils/utility')
module.exports = {
  config: {
    name: 'restart',
    usage: 'restart',
    aliases: ['rt'],
    description: 'Restart the bot',
    ownerOnly: true,
    enabled: true
  },
  async run (client, message, args) {
    const { exec } = require('child_process')
    try {
      exec(`pm2 restart ${process.env.pm2Name}`, async (err, out, stderr) => {
        if (err) {
          console.log(err)
        }
      })
      return message.channel.send('Restart success')
    } catch (e) {
      return util.sendError(message, e)
    }
  }
}
