const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')

const ytdl = require('ytdl-core')
const dude = require('yt-dude')
module.exports = {
    name: "db",
    async run(message, args) {
        const db = low(adapter)
        let songInfo
        if (ytdl.validateURL(args[0])) {
            songInfo = await ytdl.getInfo(args[0])
            fuck();
        } else if (!ytdl.validateURL(args[0])) {
            let query = await dude.search(args);
            let url = "https://www.youtube.com/watch?v=" + query[0].videoId;
            songInfo = await ytdl.getInfo(url)
            fuck();
        }
        // Set some defaults (required if your JSON file is empty)
        async function fuck() {
            let title = songInfo.title
            //console.log(typeof message.author.username)
            let logic = db.get('song')
                .find({
                    title: title
                }).value();
            console.log(logic);
            if (!logic) {
                db.get('song')
                    .push({
                        id: 1,
                        title: title,
                        count: 0
                    })
                    .write()

            };
            if (logic) {
                console.log('fuck')
                db.get('song').find({
                        title: title
                    })
                    .update('count', n => n + 1)
                    .write()
            }
            db.defaults({
                    song: [],
                    user: {},
                    count: 0
                })
                .write()
        }
    }
}