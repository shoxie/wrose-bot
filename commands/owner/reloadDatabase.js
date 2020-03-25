const guildSettings = require("../../model/guildSettingsModel");
module.exports = {
  config: {
    name: "reloadDatabase",
    usage: "reloadDatabase",
    description:
      "Reload the whole database, this will overwrite the current database",
    ownerOnly: true,
    enabled: true
  },
  async run(client, message, args) {
    if (message.author.id !== "155622262660268033") return;
    const guilds = client.guilds.cache;
    
    client.guilds.cache.map(async guild => {
      let data = {
        name: guild.name,
        id: guild.id
      };
      await guildSettings.addNewGuild(data);
    });
  }
};
