const mongoose = require('mongoose')
const { getSongInfo } = require('../utils/utility')
const playlistSchema = mongoose.Schema({
  songName: { type: String },
  link: { type: String, required: true },
  author: {
    type: String
  }
})
const playlist = mongoose.model('playlist', playlistSchema)

const addPlaylist = async (url, authorID) => {
  const songInfo = await getSongInfo(url)
  const song = new playlist({
    songName: songInfo.title,
    link: songInfo.video_url,
    author: authorID
  })
  return song.save()
}
const getPlaylist = async (authorID) => {
  const playlistArr = playlist.find({ author: authorID })
  return playlistArr
}
const deleteSong = async (song, authorID) => {
  const a = playlist.findOneAndDelete({ songName: song, author: authorID })
  return a
}
const destroyPlaylist = async (authorID) => {
  const a = playlist.deleteMany({ author: authorID })
  return a
}
module.exports = {
  addPlaylist,
  getPlaylist,
  deleteSong,
  destroyPlaylist
}
