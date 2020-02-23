const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/guildSettings.json");
const db = low(adapter);
const fs = require("fs");
let data = require("../data/guildSettings.json").guilds;
let Discord = require("discord.js");

module.exports = client => {
  return function() {
    client.guildSettings = new Discord.Collection();
    console.log("done loading");
    client.user.setPresence({
      game: {
        name: "with depression"
      },
      status: "online"
    });
    for (let key in data) {
      client.guildSettings.set(data[key].id, data[key]);
    }
  };
};
