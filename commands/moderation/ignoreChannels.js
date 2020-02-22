const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/guildSettings.json");
const db = low(adapter);
module.exports = {
  config: {
    name: "ignoreChannels",
    usage: "ignoreChannels [channelID]",
    description:
      "Set a text channel as an ignored channel, i will not notice any messages from this channel",
    enabled: true
  },
  async run(client, message, args) {
    let query = await db
      .get("guild")
      .find({ id: message.member.guild.id })
      .value();
    if (!query) {
      db.get("guild")
        .push({
          id: message.member.guild.id
        })
        .write();
    }

    if (query && message.member.guild.channels.find(x => x.id === args[0])) {
      console.log("here");
      await db
        .get("guild")
        .find({ id: message.member.guild.id })
        .get("ignoredChannels")
        .push(args[0])
        .write();
      message.channel.send({
        embed: {
          color: 3447003,
          title:
            message.member.guild.channels.find(x => x.id === args[0]).name +
            " will be ignored"
        }
      });
    }
  }
};
