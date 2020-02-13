const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("../../data/data.json");
const db = low(adapter);
module.exports = {
    name: 'topSongs',
    async run(message, args) {
        let songs = db.get('songs').value();
        console.log(songs)
    }
}