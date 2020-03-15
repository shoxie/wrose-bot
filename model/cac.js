let commandModel = {
  table: null,
  sendMessage(channel) {
    console.log(this.table);
    channel.send("```" + this.table + "```");
  }
};
module.exports = commandModel;
