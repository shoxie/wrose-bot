const sendSongQueue = (message, client) => {
  const serverQueue = client.queue.get(message.guild.id);
  message.channel.send({
    embed: {
      color: 3066993,
      title: "Queue added",
      url: serverQueue.queue[serverQueue.queue.length - 1].url,
      description: serverQueue.queue[serverQueue.queue.length - 1].title,
      thumbnail: {
        url: serverQueue.queue[serverQueue.queue.length - 1].thumbnail,
      },
      footer: {
        text:
          "Duration " +
          serverQueue.queue[serverQueue.queue.length - 1].duration,
      },
    },
  });
};
const sendPlaying = async (message, client) => {
  const serverQueue = client.queue.get(message.guild.id);
  const queueMsg = await message.channel.send({
    embed: {
      color: 3447003,
      title: "Playing",
      url: serverQueue.queue[0].url,
      description: serverQueue.queue[0].title,
      thumbnail: {
        url: serverQueue.queue[0].thumbnail,
      },
      footer: {
        text: "Duration " + serverQueue.queue[0].duration,
      },
    },
  });
  await queueMsg.react("👍");
  await queueMsg.react("👎");
  var dislike = 0;
  const filter = (reaction, user) =>
    reaction.emoji.name === "👎" && user.id !== client.user.id;
  const collector = queueMsg.createReactionCollector(filter, {
    time: serverQueue.queue[0].seconds * 1000,
  });
  collector.on("collect", (r) => {
    dislike++;
    if (dislike > message.member.voice.channel.members.filter(user => !user.user.bot).size / 2) {
      serverQueue.connection.dispatcher.end();
      collector.stop();
    }
  });
  collector.on("end", (collected) => {
    if (queueMsg) queueMsg.delete();
  });
};
const emptyQueue = (message) => {
  message.channel.send({
    embed: {
      color: 15158332,
      title: "No songs in the queue",
      author: {
        name: message.client.user.username,
        icon_url: message.client.user.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        }),
      },
    },
  });
};
const redMessage = (message, title, description = null) => {
  message.channel.send({
    embed: {
      color: 15158332,
      title: title,
      description: description,
      author: {
        name: message.client.user.username,
        icon_url: message.client.user.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        }),
      },
    },
  });
};
const blueMessage = (message, title, description = null) => {
  message.channel.send({
    embed: {
      color: 3447003,
      title: title,
      description: description,
      author: {
        name: message.client.user.username,
        icon_url: message.client.user.avatarURL({
          format: "png",
          dynamic: true,
          size: 1024,
        }),
      },
    },
  });
};
const sendLyrics = async (message, lyrics) => {
  var output = lyrics.split("\n");
  var myfields = [];
  var tmp = 0;
  var sttmp = "";
  for (var i = 0; i <= output.length; i++) {
    sttmp += output[i] + " \n ";
    tmp++;
    if (tmp == 15) {
      myfields.push({ name: "\u200B", value: sttmp });
      tmp = 0;
      sttmp = "";
    }
  }
};
const tryAgain = async (message) => {
  message.reply("Something happened. Please try again later");
};
module.exports = {
  sendSongQueue,
  sendPlaying,
  emptyQueue,
  blueMessage,
  redMessage,
  tryAgain,
};
