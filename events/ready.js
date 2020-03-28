let Discord = require("discord.js");
let guildSettings = require("../model/guildSettingsModel");
module.exports = client => {
  return async function() {
    client.guildSettings = new Discord.Collection();
    client.config = new Discord.Collection();
    let config = require("../config/config.json");
    for (let key in config) {
      client.config.set(key, config[key]);
    }
    console.log("done loading");
    setInterval(() => {
      client.user.setPresence({
        activity: { name:"on "+ client.ws.ping + " ms" },
        status: "dnd"
      });
    }, 10000);
    client.queue = new Discord.Collection();
    client.mute = new Discord.Collection();
    client.games = new Discord.Collection();
    //let data = await guildSettings.queryGuildSettings(null);
    //console.log(data);
    let guilds = client.guilds.cache;
    guilds.forEach(async guild => {
      let data = await guildSettings.queryGuildSettings(guild.id);
      if (!data) return;
      if (data) {
        await client.guildSettings.set(data.guildID, data);
      }
    });
  };
};
