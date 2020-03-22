const ytcore = require("ytdl-core");
const model = require("../../model/model.js");
const dude = require("yt-dude");
const getVideoId = require("get-video-id");
let musicDB = require("../../model/musicData");
const ytDiscord = require("ytdl-core-discord");
module.exports = {
  config: {
    name: "Play",
    usage: "play [song name]",
    aliases: ["p"],
    description: "Play a song from youtube",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    const voiceChannel = message.member.voice.channel;
    if (!message.member.voice.channel) {
      return message.channel.send({
        embed: {
          color: 15158332,
          description: "You have to be in a voiceChannel to use the command."
        }
      });
    }
    if (
      message.member.voice.channel &&
      serverQueue.voiceChannel.id !== message.member.voice.channel
    ) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title:
            "I'm now playing in another voiceChannel, please wait or join that voiceChannel",
          //description:
            //"If you are desperate to listen to music, use --wait in your order and i will join you immediately after i finished playing for someone else"
        }
      });
    }
    if (ytcore.validateURL(args[0])) {
      addQueue(args[0]);
    }
    if (!ytcore.validateURL(args[0])) {
      let query = await dude.search(args);
      let videoUrl = "https://www.youtube.com/watch?v=" + query[0].videoId;
      addQueue(videoUrl);
    }
    //functions
    async function addQueue(url) {
      let songInfo = await ytcore.getInfo(url);
      let song = {
        title: songInfo.title,
        url: songInfo.video_url,
        thumbnail: getThumbnail(url),
        duration: secondsCoverter(songInfo.length_seconds),
        seconds: songInfo.length_seconds,
        requester: message.author.tag
      };
      if (!serverQueue) {
        let tempQueue = {
          guildID: null,
          queue: [],
          isPlaying: false,
          voiceChannel: voiceChannel,
          textChannel: message.channel,
          connection: null,
          dispatcher: null
        };
        tempQueue.queue.push(song);
        tempQueue.connection = await tempQueue.voiceChannel.join();
        client.queue.set(message.guild.id, tempQueue);
        play(message.guild.id);
      } else {
        serverQueue.queue.push(song);
        message.channel.send({
          embed: {
            color: 3066993,
            title: "Queue added",
            url: serverQueue.queue[serverQueue.queue.length - 1].url,
            description: serverQueue.queue[serverQueue.queue.length - 1].title,
            thumbnail: {
              url: serverQueue.queue[serverQueue.queue.length - 1].thumbnail
            },
            footer: {
              text:
                `Duration ` +
                serverQueue.queue[serverQueue.queue.length - 1].duration
            }
          }
        });
      }
    }
    async function play(guild) {
      const serverQueue = client.queue.get(guild);
      if (!serverQueue.queue[0]) {
        serverQueue.isPlaying = false;
        updatePresence(serverQueue);
        serverQueue.voiceChannel.leave();
        message.channel.send({
          embed: {
            color: 15158332,
            title: "No songs in the queue",
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
        client.queue.delete(guild);
      } else {
        message.channel.send({
          embed: {
            color: 3447003,
            title: "Playing",
            url: serverQueue.queue[0].url,
            description: serverQueue.queue[0].title,
            thumbnail: {
              url: serverQueue.queue[0].thumbnail
            },
            footer: {
              text: `Duration ` + serverQueue.queue[0].duration
            }
          }
        });
        serverQueue.dispatcher = serverQueue.connection
          .play(
            ytcore(serverQueue.queue[0].url, {
              filter: "audioonly",
              quality: "highestaudio",
              highWaterMark: 1 << 25,
              encoderArgs: ["-af", `equalizer=f=40:width_type=h:width=50:g=50`]
            })
          )
          // serverQueue.dispatcher = serverQueue.connection
          //   .play(await ytDiscord(serverQueue.queue[0].url), { type: "opus" })
          .on("start", () => {
            serverQueue.isPlaying = true;
            updatePresence(serverQueue);
            addTopSong(serverQueue.queue[0].title);
          })
          .on("finish", () => {
            console.log("stop playing");
            serverQueue.queue.shift();
            play(message.guild.id);
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
            serverQueue.queue.shift();
          })
          .on("error", error => {
            console.log(error);
          });
      }
    }

    function getThumbnail(url) {
      let ids = getVideoId(url);
      return `http://img.youtube.com/vi/${ids.id}/maxresdefault.jpg`;
    }
    function addTopSong(title) {
      musicDB.updateCount(title);
    }
    function secondsCoverter(second) {
      second = Number(second);
      var m = Math.floor((second % 3600) / 60);
      var s = Math.floor((second % 3600) % 60);

      return m + ":" + s;
    }
    function updatePresence(serverQueue) {
      if (serverQueue.isPlaying === true) {
        message.member.guild.channels.cache
          .find(x => x.id === serverQueue.textChannel.id)
          .setTopic("Playing " + serverQueue.queue[0].title);
      }
      if (serverQueue.isPlaying === false) {
        message.member.guild.channels.cache
          .find(x => x.id === serverQueue.textChannel.id)
          .setTopic("Not playing");
      }
      if (message.content.includes("--lyrics")) {
        // util;
      }
    }
  }
};
