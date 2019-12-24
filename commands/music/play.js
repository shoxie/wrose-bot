const fs = require("fs");
const ytdl = require("ytdl-core");
const { YouTube } = require("better-youtube-api");
module.exports = {
  name: "play",
  catetory: "music",
  run: async (message, args) => {
    const playlist = fs.existsSync("./data/playlist.json");
    if (!playlist) {
      fs.writeFile("./data/playlist.json", "{}", err => {
        if (err) console.log(err);
      });
    }
    var voiceChannel = message.member.voiceChannel;
    if (!voiceChannel)
      return message.channel.send({
        embed: {
          description: "Vào voice channel đã."
        }
      });
    var musicModel = {
      isPlaying: false,
      queue: [],
      connection: null
    };
    let songInfo = null;
    if (ytdl.validateURL(args[0])) {
      songInfo = await ytdl.getInfo(args[0]);
      musicModel.queue.push(songInfo.url);
      musicModel.connection = await voiceChannel.join();
      play(message, songInfo, song);
    }

    var song = {
      title: songInfo.title,
      url: songInfo.video_url,
      thumbnailUrl: songInfo.player_response.videoDetails.thumbnail.thumbnails.pop()
        .url,
      duration: new Date(songInfo.length_seconds * 1000)
        .toISOString()
        .substr(11, 8)
    };

    function play(message, songInfo, song) {
      var queue = musicModel.queue;
      console.log(queue[0]);
      if (!queue[0]) {
        musicModel.isPlaying = false;
      }
      musicModel.isPlaying = true;

      const dispatcher = musicModel.connection
        .playStream(
          ytdl(songInfo.video_url, {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25
          })
        )
        .on("start", () => {
          console.log("Music started!");
          message.channel.send("playing");
        })
        .on("end", () => {
          console.log("Music ended!");
          queue.shift();
          play(message, song);
        })
        .on("error", error => {
          console.error(error);
        });
    }
  }
};
