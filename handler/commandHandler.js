const fs = require("fs");
const config = require("../config/config.json");
const Discord = require("discord.js");
const ascii = require("ascii-table");
let table = new ascii("Commands");
table.setHeading("Command", "Active status");
module.exports = async (client, message) => {
  client.commands = new Discord.Collection();
  client.aliases = new Discord.Collection();
  client.categories = fs.readdirSync("./commands/");

  fs.readdirSync("./commands/").forEach(dir => {
    const command = fs.readdirSync(`./commands/${dir}/`).filter(async file => {
      file.endsWith(".js");
      var filename = file
        .split(".")
        .slice(0, -1)
        .join(".");
      let cmdObj = require("../commands/" + dir + "/" + filename);
      client.commands.set(filename.toLowerCase(), cmdObj);
      if (cmdObj.config.aliases) {  
        for (let i in cmdObj.config.aliases) {
          client.aliases.set(cmdObj.config.aliases[i], cmdObj);
        }
      }
      table.addRow(
        client.commands.get(filename.toLowerCase()).config.name,
        client.commands.get(filename.toLowerCase()).config.enabled ? "✅" : "❌"
      );
    });
  });
  //commandModel.table = table.toString();
  console.log(table.toString());
};
