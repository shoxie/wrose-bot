let ytdl = require("ytdl-core");
let dude = require("yt-dude");
const plModel = require("../../model/playlist.model");
let {
  getSongInfo,
  getThumbnail,
  secondsCoverter,
} = require("../../utils/utility");
module.exports = {
  config: {
    name: "playlist",
    description: "Add a song to a specific playlist",
    usage: "playlist [playlist] [url]",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    let messageFlags = args[0];
    if (messageFlags === "--add") {
      if (ytdl.validateURL(args[1])) {
        addSong(args[1]);
      } else if (!ytdl.validateURL(args[1])) {
        args.splice(args.indexOf("--add"), 1);
        let query = await dude.search(args.join(" "));
        console.log(args.join(" "));
        let videoUrl = "https://www.youtube.com/watch?v=" + query[0].videoId;
        addPlaylist(videoUrl);
      }
    }
    if (messageFlags === "--play") {
      if (!message.mentions.user.first()) {
        const serverQueue = client.queue.get(message.guild.id);
        if (!serverQueue) {
          let tempQueue = {
            guildID: null,
            queue: [],
            isPlaying: false,
            voiceChannel: voiceChannel,
            textChannel: message.channel,
            connection: null,
            dispatcher: null,
          };
          tempQueue.connection = await tempQueue.voiceChannel.join();
          let songArr = await plModel.getPlaylist(message.author.id);
          for (const song of songArr) {
            let songInfo = await getSongInfo(song.link);
            let songData = {
              title: songInfo.title,
              url: songInfo.video_url,
              thumbnail: getThumbnail(url),
              duration: secondsCoverter(songInfo.length_seconds),
              seconds: songInfo.length_seconds,
              requester: message.author.tag,
            };
            tempQueue.queue.push(songData);
          }
          client.queue.set(message.guild.id, tempQueue);
        }
      }
    }
    async function addPlaylist(url) {
      try {
        let a = await plModel.addPlaylist(url, message.author.id);
        let songInfo = await getSongInfo(url);
        message.channel.send({
          embed: {
            color: 3447003,
            title: "Added one song playlist",
            fields: [
              {
                name: "Song name",
                value: songInfo.title,
              },
              {
                name: "Song URL",
                value: songInfo.video_url,
              },
              {
                name: "Playlist author",
                value: message.author.tag,
              },
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
};
