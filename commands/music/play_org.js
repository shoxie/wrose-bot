const fs = require("fs");
const ytdl = require("ytdl-core");
const musicModel = require("../../model/model.js");
let dude = require("yt-dude");
const youtubeDL = require("youtube-dl");
const getVideoId = require("get-video-id");

module.exports = {
  name: "play",
  async run(message, args) {
    var voiceChannel = message.member.voiceChannel;
    musicModel.voiceChannel = voiceChannel;
    if (ytdl.validateURL(args[0]) && musicModel.isPlaying == true) {
      return musicModel.queue.push(args[0]);
      getSongInfo(args[0]);
    } else if (ytdl.validateURL(args[0]) && musicModel.isPlaying == false) {
      musicModel.queue.push(args[0]);
      let video_id = getVideoId(args[0]).id;
      musicModel.thumbnail = `http://img.youtube.com/vi/${video_id}/hqdefault.jpg`;
      musicModel.connection = await voiceChannel.join();
      play();
    } else if (!ytdl.validateURL(args[0])) {
      let query = await dude.search(args);
      let url = "https://www.youtube.com/watch?v=" + query[0].videoId;
      musicModel.thumbnail = `http://img.youtube.com/vi/${query[0].videoId}/hqdefault.jpg`;
      musicModel.queue.push(url);
      musicModel.connection = await voiceChannel.join();
      play();
    }

    async function play() {
      var queue = musicModel.queue;
      await musicModel.getSongInfo(queue[0]);
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
          musicModel.isPlaying = true;
          message.channel.send({
            embed: {
              title: musicModel.songInfo.title,
              description: "tests",
              thumbnail: {
                url: musicModel.thumbnail
              }
            }
          });
        })
        .on("end", () => {
          if (!queue[0]) {
            voiceChannel.leave();
            musicModel.isPlaying = false;
            console.log("leave");
            message.channel.send({
              embed: {
                title: "Leaving voiceChannel",
                description: "No song left in the queue"
              }
            });
          } else if (musicModel.queue[0]) {
            addQueue()
          }
        })
        .on("error", error => {
          console.log(error);
        });
    }
    async function addQueue(url) {
      musicModel.queue.push(url);
      if (musicModel.isPlaying == false && musicModel.queue[0]) {
        play();
      }
      if (musicModel.isPlaying == true && musicModel.queue[0]) {
        addQueue(url);
        musicModel.getSongInfo();
        console.log(musicModel.songInfo.player_response);
      }
    }
  }
};