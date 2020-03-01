let ytdl = require("ytdl-core");
let dude = require("yt-dude");
module.exports = {
  config: {
    name: "playlist",
    description: "Add a song to a specific playlist",
    usage: "playlist --arguement [playlist name] [url]",
    enabled: true
  },
  async run(client, message, args) {
    let messageFlags = args[0];
    if (messageFlags === "--add") {
      if (ytdl.validateURL(args[1])) {
        addSong(args[1]);
      } else if (!ytdl.validateURL(args[1])) {
        let query = await dude.search(args);
        let videoUrl = "https://www.youtube.com/watch?v=" + query[0].videoId;
        addSong(videoUrl);
      }
    }

    async function addSong(url) {}
  }
};
