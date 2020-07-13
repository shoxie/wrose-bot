const { exec } = require('child_process')
module.exports = {
  config: {
    name: 'update',
    usage: 'update',
    aliases: [],
    description: 'Command for owner to update and restart the bot',
    ownerOnly: true,
    enabled: true
  },
  async run (client, message, args) {
    try {
      exec('git pull && pm2 restart all', (stdout, stderr) => {
        message.channel.send('update: ```' + stdout + '```')
      })
    } catch (error) {
      message.author.send(error.message)
    }
  }
}
