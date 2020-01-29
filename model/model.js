let ytdl = require('ytdl-core')
let message;
let musicModel = {
  isPlaying: false,
  queue: [],
  voiceChannel: null,
  connection: null,
  songInfo: null,
  thumbnail: null,
  async getSongInfo(url) {
    this.songInfo = await ytdl.getInfo(url)
  },
  async sendMessage(channel) {
    channel.send({
      embed: {
        title: this.songInfo.title,
        description: 'this is the description',
        thumbnail: {
          url: this.thumbnail
        }
      }
    })
  }
}
module.exports = musicModel;