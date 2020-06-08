const plModel = require("../model/playlist.model");
const { blueMessage } = require("./message");
let {
  secondsCoverter,
  getThumbnail,
  getSongInfo,
  shuffleArray,
} = require("./utility");
const initQueue = async (message) => {
  let voiceChannel = message.member.voice.channel;
  let tempQueue = {
    guildID: null,
    queue: [],
    isPlaying: false,
    radio: false,
    voiceChannel: voiceChannel,
    textChannel: message.channel,
    connection: null,
    dispatcher: null,
  };
  tempQueue.connection = await tempQueue.voiceChannel.join();
  return tempQueue;
};
const addPlaylistToQueue = async (message, queue, user) => {
  let songArr = await plModel.getPlaylist(user);
  songArr = shuffleArray(songArr);
  let i = 1;
  for (const song of songArr) {
    let songInfo = await getSongInfo(song.link);
    let songData = {
      title: `${i}/` + songInfo.title,
      url: songInfo.video_url,
      thumbnail: getThumbnail(songInfo.video_url),
      duration: secondsCoverter(songInfo.length_seconds),
      seconds: songInfo.length_seconds,
      requester: message.author.tag,
    };
    queue.queue.push(songData);
  }
  blueMessage(message, "Added " + songArr.length + " songs to queue");
  return queue;
};
module.exports = {
  initQueue,
  addPlaylistToQueue,
};
