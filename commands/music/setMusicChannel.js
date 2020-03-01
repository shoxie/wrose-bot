let guildSettings = require("../../model/guildSettingsModel");
module.exports = {
  config: {
    name: "setMusicChannel",
    usage: "setMusicChannel [textChannelID]",
    description: "Set a textChannel as a music command receiver",
    enabled: true
  },
  async run(client, message, args) {
    if (!message.member.voice.channel) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "You have to be in a voiceChannel to setup the musicChannel"
        }
      });
      return;
    }
    if (message.member.guild.channels.cache.find(x => x.id === args[0])) {
      let data = {
        guildID: message.member.guild.id,
        musicTextChannel: args[0],
        musicVoiceChannel: message.member.voice.channelID
      };
      guildSettings.updateMusicChannel(data);
      client.guildSettings.set(data.guildID, data);
      message.channel.send({
        embed: {
          color: 15158332,
          title:
            message.member.guild.channels.cache.find(x => x.id === args[0])
              .name +
            " and " +
            message.member.guild.channels.cache.find(
              x => x.id === message.member.voice.channelID
            ).name +
            " are now the text and voice channel for music",
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024
            })
          }
        }
      });
    } else {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "Cannot find the specific channel",
          author: {
            name: message.client.user.username,
            icon_url: message.client.user.avatarURL({
              format: "png",
              dynamic: true,
              size: 1024
            })
          }
        }
      });
    }
  }
};
