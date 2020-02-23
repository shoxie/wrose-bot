let mongoose = require("mongoose");
let musicSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true
  },
  count: {
    type: Number,
    default: 1
  }
});
var music = mongoose.model("music", musicSchema);
async function updateCount(title) {
  music.findOne({ name: title }, async function(error, result) {
    if (result) {
      music.findOneAndUpdate(
        { name: title },
        { $inc: { count: 1 } },
        async function(error, doc, res) {
          if (error) console.log(error);
        }
      );
    }
    if (!result) {
      let song = new music({
        name: title
      });
      await song.save().then(() => {
        console.log("saved");
      });
    }
    if (error) console.log(error);
  });
}
async function getSongs() {
  let songs = await music
    .find({})
    .sort({ count: -1 })
    .limit(10)
    .exec();
  return songs;
}
module.exports = { updateCount, getSongs };
