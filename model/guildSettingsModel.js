const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/guildSettings.json");
const db = low(adapter);

function addNewGuild(guildID, options) {
  if (!db.get("guilds").value()) {
    db.push({ guild: [] });
  }
  db.get("guilds")
    .push(options)
    .write();
}

function update(data, guildID) {
  db.get("guilds")
    .find(guildID)
    .get("ignoredChannels")
    .push(data)
    .write();
}
module.exports = {
  addNewGuild,
  update
};
