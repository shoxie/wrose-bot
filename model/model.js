const ytdl = require("ytdl-core");
let message;
let musicModel = {
  isPlaying: false,
  queue: [],
  connectinon: null,
  songInfo: this.songInfo,
  init() {
    msg = message;
    isInit = true;
  },
  async queue(args, voiceChannel) {
    if (ytdl.validateURL(args[0])) {
      if (this.isPlaying == true) {
        this.queue.push(args[0]);
      }
      musicModel.queue.pus(args[0]);
      musicModel.connection = await voiceChannel.join();
      play();
    }
  },
  play() {
    const dispatcher = this.musicModel.connection.playStream(
      ytdl(this.queue[0], {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25
      })
        .on("start", () => {
          console.log("playing");
          this.isPlaying = true;
        })
        .on("end", () => {
          this.isPlaying = false;
          this.play();
        })
    );
  },
  async getSongInfo() {
    if (ytdl.validateURL(args[0])) {
      songInfo = await ytdl.getInfo(args[0]);
    }
    return songInfo;
  }
};
module.exports = musicModel;
