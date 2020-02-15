const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/guildSettings.json");
const db = low(adapter);
module.exports = {
  config: {
    name: 'setMusicChannel',
    enabled: true,
    usage: 'setMusicChannel [textChannelID]'
  },
  async run(client, message, args) {
    if (!message.member.voiceChannel) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "You have to be in a voiceChannel to setup the musicChannel"
        }
      });
      return;
    }
    let guildName = message.member.guild.name;
    db.defaults({
      guild: []
    }).write();
    let guildID = await db
      .get("guild")
      .find({
        id: message.member.guild.id
      })
      .value();
    if (!guildID) {
      db.get("guild")
        .push({
          id: message.member.guild.id,
          musicVoiceChannel: null,
          musicTextChannel: null
        })
        .write();
    }
    if (
      args[0] != undefined &&
      message.member.guild.channels.find(x => x.id === args[0])
    ) {
      //console.log(message.member.guild.channels.find(x => x.id === args[0]))
      db.get("guild")
        .find({
          id: message.member.guild.id
        })
        .update("musicVoiceChannel", n => (n = message.member.voiceChannelID))
        .update("musicTextChannel", n => (n = args[0]))
        .write();
      message.channel.send({
        embed: {
          color: 15158332,
          title: message.member.guild.channels.find(x => x.id === args[0]).name + ' and ' + message.member.guild.channels.find(x => x.id === message.member.voiceChannelID) + ' are now the text and voice channel for music',
        }
      })
    } else {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "Cannot find the specific channel"
        }
      });
    }
  }
};