const mongoose = require('mongoose')
const musicSchema = mongoose.Schema({
  name: {
    type: String
  },
  count: {
    type: Number,
    default: 1
  },
  guildID: {
    type: String
  }
})
var music = mongoose.model('music', musicSchema)
async function updateCount (title, guildID) {
  music.findOne({ name: title, guildID: guildID }, async function (
    error,
    result
  ) {
    if (result) {
      music.findOneAndUpdate(
        { name: title, guildID: guildID },
        { $inc: { count: 1 } },
        async function (error, doc, res) {
          if (error) console.log(error)
        }
      )
    }
    if (!result) {
      const song = new music({
        name: title,
        guildID: guildID
      })
      await song.save().then(() => {
        console.log('saved')
      })
    }
    if (error) console.log(error)
  })
}
async function getSongs () {
  const songs = await music.find({}).sort({ count: -1 }).limit(10).exec()
  return songs
}
const guildTop = async (guildID) => {
  const songs = await music
    .find({ guildID: guildID })
    .sort({ count: -1 })
    .limit(10)
    .exec()
  return songs
}
module.exports = { updateCount, getSongs, guildTop }
