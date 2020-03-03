let ytdl = require("ytdl-core");
let message;
const getVideoId = require("get-video-id");
function queueConstruct() {
  let musicModel = {
    guildID: null,
    queue: [],
    isPlaying: false,
    voiceChannel: null,
    connection: null,
    dispatcher: null
  };
  return musicModel;
}
function sendQueueMessage(songQueue, channel) {
  channel.send({
    embed: {
      color: 3066993,
      title: "Queue added",
      url: songQueue.queue[songQueue.queue.length - 1].url,
      description: songQueue.queue[songQueue.queue.length - 1].title,
      thumbnail: {
        url: songQueue.queue[songQueue.queue.length - 1].thumbnail
      },
      footer: {
        text: `Duration ` + songQueue.queue[songQueue.queue.length - 1].duration
      }
    }
  });
}
function sendPlayMessage(songQueue, message) {
  message.channel.send({
    embed: {
      color: 3447003,
      title: "Playing",
      url: songQueue.queue[0].url,
      description: songQueue.queue[0].title,
      thumbnail: {
        url: songQueue.queue[0].thumbnail
      },
      footer: {
        text: `Duration ` + songQueue.queue[0].duration
      }
    }
  });
  message.client.user.setPresence({
    activity: {
      name: songQueue.queue[0].title
    },
    status: "dnd"
  });
}
function clearInstances(songQueue, message) {
  message.client.user.setPresence({
    game: {
      name: "with the Doctor"
    },
    status: "online"
  });
  songQueue.connection = null;
  songQueue.voiceChannel = null;
  songQueue.dispatcher = null;
}

module.exports = {
  sendQueueMessage,
  sendPlayMessage,
  clearInstances,
  queueConstruct
};
