const guildSettingsModel = require("../../model/guildSettingsModel");
module.exports = {
  config: {
    name: "setMusicChannel",
    usage: "setMusicChannel [textChannelID]",
    description: "Set a textChannel as a music command receiver",
    enabled: true
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
    if (message.member.guild.channels.find(x => x.id === args[0])) {
      let guildID = message.member.guild.id;
      let musicTextChannel = args[0];
      let musicVoiceChannel = message.member.voiceChannelID;
      guildSettingsModel.updateMusicChannel(
        musicTextChannel,
        musicVoiceChannel,
        guildID
      );
      message.channel.send({
        embed: {
          color: 15158332,
          title:
            message.member.guild.channels.find(x => x.id === args[0]).name +
            " and " +
            message.member.guild.channels.find(
              x => x.id === message.member.voiceChannelID
            ).name +
            " are now the text and voice channel for music"
        }
      });
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
