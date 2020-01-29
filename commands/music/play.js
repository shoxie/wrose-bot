const fs = require("fs");
const ytdl = require("ytdl-core");
const musicModel = require("../../model/model.js");
let dude = require("yt-dude");
const youtubeDL = require("youtube-dl");
const getVideoId = require("get-video-id");
const {
  performance
} = require("perf_hooks");
module.exports = {
  name: "play",
  async run(message, args) {
    // var t0 = performance.now();
    addQueue = timeExecute(addQueue)
    play = timeExecute(play)
    getThumbnail = timeExecute(getThumbnail)
    //do some thing

    if (ytdl.validateURL(args[0])) {
      addQueue(args[0]);
    }
    if (!ytdl.validateURL(args[0])) {
      let query = await dude.search(args);
      let videoUrl = "https://www.youtube.com/watch?v=" + query[0].videoId;
      addQueue(videoUrl);
    }

    async function addQueue(url) {
      if (musicModel.isPlaying == false) {
        musicModel.queue.push(url);
        musicModel.songInfo = await ytdl.getInfo(url);
        play();
      }
      if (musicModel.isPlaying == true) {
        musicModel.queue.push(url);
        console.log(musicModel.queue);
        musicModel.songInfo = await ytdl.getInfo(url);
        message.channel.send({
          embed: {
            title: musicModel.songInfo.title,
            description: "this is the description",
            thumbnail: {
              url: musicModel.thumbnail
            }
          }
        });
      }
      musicModel.thumbnail = getThumbnail(url);
    }
    async function play() {
      if (!musicModel.voiceChannel)
        musicModel.voiceChannel = message.member.voiceChannel;
      musicModel.connection = await musicModel.voiceChannel.join();
      const dispatcher = musicModel.connection
        .playStream(
          ytdl(musicModel.queue[0], {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25
          })
        )
        .on("start", () => {
          musicModel.isPlaying = true;
          musicModel.sendMessage(message.channel);
        })
        .on("end", () => {
          musicModel.queue.shift();
          if (musicModel.queue[0]) {
            console.log("next song url " + musicModel.queue[0]);
            play();
          }
          if (!musicModel.queue[0]) {
            musicModel.connection.leave();
            musicModel.isPlaying = false;
            message.channel.send({
              embed: {
                title: "Leaving voiceChannel",
                description: "No songs left in the queue"
              }
            });
          }
        })
        .on("error", error => {
          console.log(error);
        });
    }

    function getThumbnail(url) {
      let ids = getVideoId(url);
      musicModel.thumbnail = `http://img.youtube.com/vi/${ids}/hqdefault.jpg`;
    }
    // var t1 = performance.now();
    // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
  }
};





function timeExecute(f) {
  return function wrapper(...args) {
    var t0 = performance.now();
    const res = f.apply(this, args);
    var t1 = performance.now();
    console.log("Call to " + f.name + " took " + (t1 - t0) + " milliseconds.");
    return res; // make post() work
  };
}