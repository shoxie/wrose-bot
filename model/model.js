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
        url: this.queue[this.queue.length].url,
        description: this.queue[this.queue.length].title,
        thumbnail: {
          url: this.queue[this.queue.length].thumbnail
        },
        footer: {
          text: `Duration ` + this.queue[this.queue.length].duration
        }
      }
    })
  },
  sendPlayMessage(message) {
    message.channel.send({
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
    });
    message.client.user.setPresence({
      game: {
        name: this.queue[0].title
      },
      status: 'online'
    });
  }
}
module.exports = musicModel;