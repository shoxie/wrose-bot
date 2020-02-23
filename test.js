let data = require("./data/guildSettings.json").guilds;
let Discord = require("discord.js");
let guildSettings = new Discord.Collection();

for (let key in data) {
  console.log(data[key].id);
}
