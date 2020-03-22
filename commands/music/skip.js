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
    if (!serverQueue) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: "No songs in the queue",
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

    if (!message.member.roles.cache.has(requiredRole.id)) {
      return message.channel.send({
        embeD: {
          color: 15158332,
          title: "You do not have the DJ role."
        }
      });
    } else if (message.member.voice.channel != serverQueue.voiceChannel) {
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

    serverQueue.connection.dispatcher.end();
  }
};
