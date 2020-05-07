const { isSC, isYT, secondsCoverter } = require("./utility");
const { initQueue } = require("./queue");
const dude = require("yt-dude");
const util = require("util");
const youtubeDL = require("youtube-dl");
const getInfo = util.promisify(youtubeDL.getInfo);
let { sendSongQueue, sendPlaying, emptyQueue } = require("./message");

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
  if (!serverQueue.queue[0]) {
    serverQueue.isPlaying = false;
    serverQueue.voiceChannel.leave();
    client.queue.delete(message.guild.id);
  } else {
    sendPlaying(message, client);
    serverQueue.dispatcher = serverQueue.connection
      .play(youtubeDL(serverQueue.queue[0].url))
      .on("start", () => {
        serverQueue.isPlaying = true;
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
        console.log(error);
      });
  }
};

module.exports = {
  validate,
  addQueue,
  player,
};
