let Discord = require("discord.js");
let guildSettings = require("../model/guildSettingsModel");
module.exports = client => {
  return async function() {
    client.guildSettings = new Discord.Collection();
    console.log("done loading");
    client.user.setPresence({
      activity: { name: "developed by the Doctor" },
      status: "dnd"
    });
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
