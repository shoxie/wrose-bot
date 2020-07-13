const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('./data/guildSettings.json')
const db = low(adapter)
module.exports = {
  config: {
    name: 'musicMasterRole',
    usage: 'musicMasterRole [role id]',
    description: 'Set the DJ role',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const guild = db
      .get('guild')
      .find({
        id: message.member.guild.id
      })
      .value()
    if (!guild) {
      db.get('guild')
        .push({
          id: message.member.guild.id
        })
        .write()
    }
    if (guild && message.member.guild.roles.cache.find(x => x.id === args[0])) {
      db.get('guild')
        .find({
          id: message.member.guild.id
        })
        .push({
          musicMasterRole: args[0]
        })
        .write()
      message.channel.send({
        embed: {
          color: 3447003,
          title:
            message.member.guild.roles.cache.find(x => x.id === args[0]).name +
            ' has been choosen as musicMasterRole',
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
      message.channel.send({
        embed: {
          color: 15158332,
          title: 'Cannot find the specific role',
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
    }
  }
}
