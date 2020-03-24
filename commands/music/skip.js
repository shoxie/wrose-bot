let serverQueue = require("../../model/model");
module.exports = {
  config: {
    name: "skip",
    usage: "skip",
    description: "Skip a playing song.",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let serverQueue = client.queue.get(message.guild.id);
    let normaldj = message.guild.roles.cache.find(x => x.name === 'dj');
    let bigdj = message.guild.roles.cache.find(x => x.name === 'DJ');
    let roleID = bigdj ? bigdj : normaldj;
    if (!roleID) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title:
            "Your guild does not have the DJ role, please contact your guild owner/administrator/moderator to create and add the role."
        }
      });
    }
    if(message.member.roles.cache.has(roleID.id)) {
      if (message.member.voice.channel != serverQueue.voiceChannel) {
          // undefined
          return message.channel.send({
            embed: {
              title:
                "You have to be in the same channel with the me to use the command",
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
      else serverQueue.connection.dispatcher.end();
    }
    else return message.channel.send({
          embed: {
            color: 15158332,
            title: "You do not have the DJ role."
          }
        }); 
  }
};
