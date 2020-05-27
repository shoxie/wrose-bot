const {
  isSC,
  isYT,
  secondsCoverter,
  updatePresence,
  sendError,
} = require("./utility");
const { initQueue } = require("./queue");
const dude = require("yt-dude");
const util = require("util");
const youtubeDL = require("youtube-dl");
const getInfo = util.promisify(youtubeDL.getInfo);
const {
  sendSongQueue,
  sendPlaying,
  emptyQueue,
  redMessage,
} = require("./message");
const { updateCount } = require("../model/musicData");
let youtubeDLOptions = [
  "--quiet",
  "--ignore-errors",
  "--simulate",
  "--no-warnings",
  "--format=bestaudio[protocol^=http]",
  "--user-agent=KaraDiscordBot (https://bastion.traction.one)",
  "--referer=https://bastion.traction.one",
  "--youtube-skip-dash-manifest",
];
const validate = async (client, message, args) => {
  if (isYT(args) || isSC(args)) {
    addQueue(client, message, args);
  } else {
    let query = await dude.search(args);
    let videoUrl = "https://www.youtube.com/watch?v=" + query[0].videoId;
    addQueue(client, message, videoUrl);
  }
};
const addQueue = async (client, message, url) => {
  const serverQueue = client.queue.get(message.guild.id);
  let songInfo = await getInfo(url, youtubeDLOptions);
  let song = {
    title: songInfo.title,
    url: songInfo.webpage_url,
    duration: songInfo.duration,
    seconds: songInfo._duration_raw,
    requester: message.author.tag,
    thumbnail: songInfo.thumbnail,
  };
  if (!serverQueue) {
    let tempQueue = await initQueue(message);
    tempQueue.queue.push(song);
    client.queue.set(message.guild.id, tempQueue);
    player(client, message);
  } else {
    serverQueue.queue.push(song);
    sendSongQueue(message, client);
  }
};
const player = async (client, message) => {
  const serverQueue = client.queue.get(message.guild.id);
  try {
    if (!serverQueue.queue[0]) {
      serverQueue.isPlaying = false;
      updatePresence(message, serverQueue);
      serverQueue.voiceChannel.leave();
      emptyQueue(message);
      client.queue.delete(message.guild.id);
    } else {
      sendPlaying(message, client);
      serverQueue.dispatcher = serverQueue.connection
        .play(youtubeDL(serverQueue.queue[0].url))
        .on("start", () => {
          serverQueue.isPlaying = true;
          updatePresence(message, serverQueue);
          updateCount(serverQueue.queue[0].title);
        })
        .on("finish", () => {
          serverQueue.queue.shift();
          player(client, message);
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
                  size: 1024,
                }),
              },
            },
          });
        })
        .on("end", () => {
          serverQueue.queue.shift();
        })
        .on("error", (error) => {
          redMessage(message, error.name, error.message);
          // const { exec } = require("child_process");
          // try {
          //   exec(
          //     `pm2 restart ${process.env.pm2Name}`,
          //     async (err, out, stderr) => {
          //       if (err) {
          //         console.log(err);
          //       }
          //     }
          //   );
          //   return message.channel.send("Restart success");
          // } catch (e) {
          //   return sendError(message, e);
          // }
        });
    }
  } catch (error) {
    await serverQueue.voiceChannel.leave();
    client.queue.delete(message.guild.id);
  }
};

module.exports = {
  validate,
  addQueue,
  player,
};
