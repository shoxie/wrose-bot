const ytdl = require("ytdl-core");
let message;
let musicModel = {
  isPlaying: false,
  queue: [],
  connection: null,
  songInfo: null
}
module.exports = musicModel;