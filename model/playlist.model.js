let mongoose = require("mongoose");
let { getSongInfo } = require("../utils/utility");
let playlistSchema = mongoose.Schema({
  songName: { type: String },
  link: { type: String, required: true },
  author: {
    type: String,
  },
});
let playlist = mongoose.model("playlist", playlistSchema);

const addPlaylist = async (url, authorID) => {
  let songInfo = await getSongInfo(url);
  let song = new playlist({
    songName: songInfo.title,
    link: songInfo.video_url,
    author: authorID,
  });
  return song.save();
};
const getPlaylist = async (authorID) => {
  let playlistArr = playlist.find({ author: authorID });
  return playlistArr;
};
const deleteSong = async (song, authorID) => {
  let a = playlist.findOneAndDelete({ songName: song, author: authorID });
  return a;
};
const destroyPlaylist = async (authorID) => {
  let a = playlist.deleteMany({ author: authorID });
  return a;
};
module.exports = {
  addPlaylist,
  getPlaylist,
  deleteSong,
  destroyPlaylist,
};
