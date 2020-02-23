const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/guildSettings.json");
const db = low(adapter);
const Discord = require("discord.js");
let guildSettings = new Discord.Collection();

function addNewGuild(guildID, options) {
  db.defaults({ guilds: [] }).write();
  let find = db
    .get("guilds")
    .find({ id: guildID })
    .value();
  if (!find) {
    db.get("guilds")
      .push(options)
      .write();
  }
}

function update(data, guildID) {
  console.log(data, guildID);
  db.get("guilds")
    .find({ id: guildID })
    .get("ignoredChannels")
    .push(data)
    .write();
  db.read();
}
module.exports = {
  addNewGuild,
  update
};
