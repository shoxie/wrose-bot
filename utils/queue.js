const plModel = require("../model/playlist.model");
let { secondsCoverter, getThumbnail, getSongInfo } = require("./utility");
const initQueue = async (message) => {
  let voiceChannel = message.member.voice.channel;
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
  return tempQueue;
};
const addPlaylistToQueue = async (message, queue) => {
  let songArr = await plModel.getPlaylist(message.author.id);
  for (const song of songArr) {
    let songInfo = await getSongInfo(song.link);
    let songData = {
      title: songInfo.title,
      url: songInfo.video_url,
      thumbnail: getThumbnail(songInfo.video_url),
      duration: secondsCoverter(songInfo.length_seconds),
      seconds: songInfo.length_seconds,
      requester: message.author.tag,
    };
    queue.queue.push(songData);
  }
  return queue;
};
module.exports = {
  initQueue,
  addPlaylistToQueue,
};
