const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/playlist.json");
const db = low(adapter);
let ytdl = require('ytdl-core');
let dude = require('yt-dude')
module.exports = {
    config: {
        name: 'playlist',
        enabled: true,
        usage: 'playlist --arguement [playlist name] [url]'
    },
    async run(client, message, args) {
        let messageFlags = args[0];
        if (messageFlags === '--add') {
            if (ytdl.validateURL(args[1])) {
                addSong(args[1])
            } else if (!ytdl.validateURL(args[1])) {
                let query = await dude.search(args);
                let videoUrl = "https://www.youtube.com/watch?v=" + query[0].videoId;
                addSong(videoUrl);
            }
        }

        async function addSong(url) {
            db.defaults({
                playlist: []
            })
            let playlistName = await db.get('playlist').find({
                name: args[2]
            })
            if (!playlistName) {
                await db.get('playlist').push({
                    name: args[2],
                    songs: []
                })
                db.get('playlist').find({
                    name: args[2]
                }).get('songs').push({
                    url
                })
            }
            if (playlistName) {
                db.get('playlist').find({
                    name: args[2]
                }).get('songs').push({
                    url
                })
            }
        }
    }
}