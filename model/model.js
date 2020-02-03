let ytdl = require('ytdl-core')
let message;
const getVideoId = require("get-video-id");

let musicModel = {
  isPlaying: false,
  queue: [],
  voiceChannel: null,
  connection: null,
  songInfo: null,
  thumbnail: null,
  dispatcher: null,
  async getSongInfo(url) {
    this.songInfo = await ytdl.getInfo(url)
  },
  async sendMessage(channel) {
    let ids = this.songInfo.video_id;
    this.thumbnail = `http://img.youtube.com/vi/${ids}/hqdefault.jpg`
    channel.send({
      embed: {
        title: this.songInfo.title,
        description: 'this is the description',
        thumbnail: {
          url: this.thumbnail
        },
        footer: {
          text: `Duration ` + this.songInfo.length_seconds
        }
      }
    })
  }
}
module.exports = musicModel;