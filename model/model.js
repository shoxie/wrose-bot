let ytdl = require('ytdl-core')
let message;
const getVideoId = require("get-video-id");

let musicModel = {
  isPlaying: false,
  queue: [],
  voiceChannel: null,
  connection: null,
  dispatcher: null,
  sendQueueMessage(channel) {
    channel.send({
      embed: {
        color: 3066993,
        title: 'Queue added',
        url: this.queue[0].url,
        description: this.queue[0].title,
        thumbnail: {
          url: this.queue[0].thumbnail
        },
        footer: {
          text: `Duration ` + this.queue[0].duration
        }
      }
    })
  },
  sendPlayMessage(channel) {
    channel.send({
      embed: {
        color: 3447003,
        title: 'Playing',
        url: this.queue[0].url,
        description: this.queue[0].title,
        thumbnail: {
          url: this.queue[0].thumbnail
        },
        footer: {
          text: `Duration ` + this.queue[0].duration
        }
      }
    })
  }
}
module.exports = musicModel;