let Discord = require("discord.js");
let guildSettings = require("../model/guildSettingsModel");
module.exports = client => {
  return async function() {
    client.guildSettings = new Discord.Collection();
    console.log("done loading");
    client.user.setPresence({
      game: {
        name: "with depression"
      },
      status: "online"
    });
    //let data = await guildSettings.queryGuildSettings(null);
    //console.log(data);
    let guilds = client.guilds;
    guilds.forEach(async guild => {
      let data = await guildSettings.queryGuildSettings(guild.id);
      if (!data) return;
      if (data) {
        await client.guildSettings.set(data.guildID, data);
      }
    });
  };
};
