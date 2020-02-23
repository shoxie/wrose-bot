const ascii = require("ascii-table");
let table = new ascii("Commands");

function addRow(filename, client) {
  table.setHeading("Command", "Load status", "Active status");
  for (let index in client.commands) {
    console.log("here");
    table.addRow(
      client.commands.get(commands[index]).config.name,
      client.commands.get(commands[index]).config.name,
      client.commands.get(commands[index]).config.enabled
    );
    console.log(index);
  }
  //console.log(table.toString());
}
function sendTable() {
  table.toString();
}
module.exports = { addRow, sendTable };
