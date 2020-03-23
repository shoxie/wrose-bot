let serverQueue = require("../../model/model.js");
module.exports = {
  config: {
    name: "disconnect",
    usage: "disconnect",
    description: "Disconnect me from the voiceChannel",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let serverQueue = client.queue.get(message.guild.id);
    let requiredRole = message.guild.roles.cache.find(
      x => x.name === "DJ" || "dj"
    );
    if (!requiredRole) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title:
            "Your guild does not have the DJ role, please contact your guild owner/administrator/moderator to create and add the role."
        }
      });
    }
    if (!serverQueue.voiceChannel) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: "__***YOU IDIOT***__",
          description: "I AM NOT EVEN IN A VOICE CHANNEL",
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
    if (serverQueue.voiceChannel) {
      if (
        message.member.roles.cache.has(
          message.guild.roles.cache.find(x => x.name === "DJ" || "dj")).id) {
        serverQueue.connection.dispatcher.end();
        message.channel.send({
          embed: {
            title: "Disconnected from voiceChannel",
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
      } else return message.channel.send("Mày định đảo chính hả ???");
    }
  }
};
