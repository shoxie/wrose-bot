const Discord = require('discord.js')
const guildSettings = require('../model/guildSettingsModel')

module.exports = (client) => {
  return async function () {
    client.guildSettings = new Discord.Collection()
    client.config = new Discord.Collection()
    const config = require('../config/config.json')
    for (const key in config) {
      client.config.set(key, config[key])
    }
    console.log('done loading')
    setInterval(() => {
      client.user.setPresence({
        activity: { name: 'on ' + client.ws.ping + ' ms' },
        status: 'dnd'
      })
    }, 10000)
    client.queue = new Discord.Collection()
    client.mute = new Discord.Collection()
    client.games = new Discord.Collection()
    client.warewolf = new Discord.Collection()
    client.levels = require('../utils/xpclass.js')
    // client.levels.setURL(process.env.MONGO_URL)
    // let data = await guildSettings.queryGuildSettings(null);
    // console.log(data);
    const guilds = client.guilds.cache
    guilds.forEach(async (guild) => {
      const data = await guildSettings.queryGuildSettings(guild.id)
      if (!data) return
      if (data) {
        data.gameConfig = {
          category: 27,
          categoryName: 'Animals',
          difficulty: 'hard',
          numberQuestions: 5
        }
        await client.guildSettings.set(data.guildID, data)
      }
    })
  }
}
