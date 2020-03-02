const ytdl = require("ytdl-core");
const musicModel = require("../../model/model.js");
const dude = require("yt-dude");
const getVideoId = require("get-video-id");
let musicDB = require("../../model/musicData");
module.exports = {
  config: {
    name: "Play",
    usage: "play [song name]",
    description: "Play a song from youtube",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (!message.member.voice.channel) {
      return message.channel.send({
        embed: {
          color: 15158332,
          description: "You have to be in a voiceChannel to use the command."
        }
      });
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
      let songInfo = await ytdl.getInfo(url);
      let song = {
        title: songInfo.title,
        url: songInfo.video_url,
        thumbnail: getThumbnail(url),
        duration: secondsCoverter(songInfo.length_seconds),
        requester: message.author.tag
      };

      if (musicModel.isPlaying == false) {
        musicModel.queue.push(song);
        if (!musicModel.voiceChannel) {
          musicModel.voiceChannel = message.member.voice.channel;
        }
        musicModel.connection = await musicModel.voiceChannel.join();
        play();
      }
      if (musicModel.isPlaying == true) {
        musicModel.queue.push(song);
        musicModel.sendQueueMessage(message.channel);
      }
    }
    async function play() {
      musicModel.dispatcher = musicModel.connection
        .play(
          ytdl(musicModel.queue[0].url, {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
            encoderArgs: ["-af", `equalizer=f=40:width_type=h:width=50:g=50`]
          })
        )
        .on("start", () => {
          musicModel.isPlaying = true;
          musicModel.sendPlayMessage(message);
          addTopSong(musicModel.queue[0].title);
          updatePresence();
        })
        .on("finish", () => {
          musicModel.queue.shift();
          if (musicModel.queue[0]) {
            console.log("next song url " + musicModel.queue[0].url);
            play();
          }
          if (!musicModel.queue[0]) {
            musicModel.voiceChannel.leave();
            musicModel.isPlaying = false;
            message.channel.send({
              embed: {
                color: 15158332,
                title: "Leaving voiceChannel",
                description: "No songs left in the queue"
              }
            });
            musicModel.clearInstances(message);
            updatePresence();
          }
        })
        .on("volumeChange", (oldVolume, newVolume) => {
          message.channel.send({
            embed: {
              title: `Volume changed from ${oldVolume} to ${newVolume}.`,
              author: {
                name: message.client.user.username,
                icon_url: message.client.user.avatarURL({
                  format: "png",
                  dynamic: true,
                  size: 1024
                })
              }
            }
          });
        })
        .on("end", () => {
          musicModel.isPlaying = false;
          updatePresence();
        })
        .on("error", error => {
          console.log(error);
        });
    }

    function getThumbnail(url) {
      let ids = getVideoId(url);
      return `http://img.youtube.com/vi/${ids.id}/maxresdefault.jpg`;
    }

    function secondsCoverter(second) {
      second = Number(second);
      var m = Math.floor((second % 3600) / 60);
      var s = Math.floor((second % 3600) % 60);

      return m + ":" + s;
    }
    function addTopSong(title) {
      musicDB.updateCount(title);
    }

    function updatePresence() {
      let textChannelId = client.guildSettings.get(message.member.guild.id)
        .musicTextChannel;
      if (textChannelId) {
        if (musicModel.isPlaying === true) {
          message.member.guild.channels.cache
            .find(x => x.id === textChannelId)
            .setTopic("Playing " + musicModel.queue[0].title);
        }
        if (musicModel.isPlaying === false) {
          message.member.guild.channels.cache
            .find(x => x.id === textChannelId)
            .setTopic("Not playing");
        }
      }
    }
  }
};
