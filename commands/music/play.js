const ytdl = require("ytdl-core");
const musicModel = require("../../model/model.js");
const dude = require("yt-dude");
const youtubeDL = require("youtube-dl");
const getVideoId = require("get-video-id");

module.exports = {
  name: "play",
  async run(message, args) {
    if (args === null) {
      return message.channel.send("fak u");
    }
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
        musicModel.songInfo = await ytdl.getInfo(url);
        musicModel.sendMessage(message.channel);
        // message.channel.send({
        //   embed: {
        //     title: musicModel.songInfo.title,
        //     description: "this is the description",
        //     thumbnail: {
        //       url: getThumbnail(url)
        //     }
        //   }
        // });
      }
      musicModel.thumbnail = getThumbnail(url);
    }
    async function play() {
      if (!musicModel.voiceChannel) {
        musicModel.voiceChannel = message.member.voiceChannel;
      }
      musicModel.connection = await musicModel.voiceChannel.join();
      musicModel.dispatcher = musicModel.connection
        .playStream(
          ytdl(musicModel.queue[0], {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25
          })
        )
        .on("start", () => {
          console.log(musicModel.queue);
          musicModel.isPlaying = true;
          musicModel.sendMessage(message.channel);
          musicModel.queue.shift();
        })
        .on("end", () => {
          if (musicModel.queue[0]) {
            console.log("next song url " + musicModel.queue[0]);
            play();
          }
          if (!musicModel.queue[0]) {
            musicModel.voiceChannel.leave();
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
      return `http://img.youtube.com/vi/${ids}/hqdefault.jpg`;
      console.log(`http://img.youtube.com/vi/${ids}/hqdefault.jpg`);
    }
  }
};