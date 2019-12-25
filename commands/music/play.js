const fs = require("fs");
const ytdl = require("ytdl-core");
const { YouTube } = require("better-youtube-api");
module.exports = {
  name: "play",
  catetory: "music",
  run: async (message, args) => {
    let voiceChannel = message.member.voiceChannel;
    if (!voiceChannel) return message.channel.send("vao voice da~");
    var musicModel = {
      isPlaying: false,
      queue: [],
      connection: null
    };
    queue();
    async function queue() {
      let songInfo = null;

      if (ytdl.validateURL(args[0])) {
        if ((musicModel.isPlaying = true))
          return musicModel.queue.push(args[0]);
        else {
          musicModel.queue.push(args[0]);
          musicModel.connection = await voiceChannel.join();
          play();
        }
      }
    }
    function play() {
      var queue = musicModel.queue;
      const dispatcher = musicModel.connection
        .playStream(
          ytdl(queue[0], {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25
          })
        )
        .on("start", () => {
          console.log("playing");
        })
        .on("end", () => {
          queue();
        });
    }
  }
};
