const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/guildSettings.json");
const db = low(adapter);
const fs = require("fs");
module.exports = client => {
  return function() {
    console.log("done loading");
    client.user.setPresence({
      game: {
        name: "with depression"
      },
      status: "online"
    });
    //console.log(client.guilds.array().sort());
  };
};
