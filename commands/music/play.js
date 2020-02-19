const ytdl = require("ytdl-core");
const musicModel = require("../../model/model.js");
const dude = require("yt-dude");
const getVideoId = require("get-video-id");
const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/data.json");
const db = low(adapter);
const guildSettingsAdapter = new FileSync("./data/guildSettings.json");
const guildSettings = low(guildSettingsAdapter);
module.exports = {
  config: {
    name: "Play",
    usage: "play [song name]",
    description: "Play a song from youtube",
    enabled: true
  },
  async run(client, message, args) {
    if (!message.member.voiceChannel) {
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
          musicModel.voiceChannel = message.member.voiceChannel;
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
        .playStream(
          ytdl(musicModel.queue[0].url, {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25
          })
        )
        .on("start", () => {
          musicModel.isPlaying = true;
          musicModel.sendPlayMessage(message);
          addTopSong(musicModel.queue[0].title);
          updatePresence();
        })
        .on("end", () => {
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
            updatePresence();
          }
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

    function voiceChannelCheck(voiceChannel) {
      db.get("guild").find({
        id: message.member.guild.id
      });
    }

    async function addTopSong(title) {
      console.log(title);
      db.defaults({
        songs: []
      }).write();
      let query = await db
        .get("songs")
        .find({
          name: title
        })
        .value();
      if (!query) {
        db.get("songs")
          .push({
            name: title,
            count: 1
          })
          .write();
      }
      if (query) {
        db.get("songs")
          .find({
            name: title
          })
          .update("count", n => n + 1)
          .write();
      }
    }

    function updatePresence() {
      let textChannel = guildSettings
        .get("guild")
        .find({
          id: message.member.guild.id
        })
        .value();
      let textChannelId = textChannel.musicTextChannel;
      if (textChannelId) {
        if (musicModel.isPlaying === true) {
          message.member.guild.channels
            .find(x => x.id === textChannelId)
            .setTopic("Playing " + musicModel.queue[0].title);
        }
        if (musicModel.isPlaying === false) {
          message.member.guild.channels
            .find(x => x.id === textChannelId)
            .setTopic("Not playing");
        }
      }
    }
  }
};
