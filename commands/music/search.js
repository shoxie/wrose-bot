let request = require("request");
let dude = require("yt-dude");
let ytdl = require('ytdl-core')
var fetchVideoInfo = require('youtube-info');
module.exports = {
    config: {
        name: 'search',
        enabled: true,
        usage: 'search [args]'
    },
    async run(message, args) {
        var start, finish;

        start = new Date();
        console.log("executing my stuff");


        let query = await dude.search(args);
        fetchVideoInfo(query[0].videoId, function (err, videoInfo) {
            if (err) throw new Error(err);
            console.log(videoInfo);
        });
        finish = new Date();

        console.log("Operation took " + (finish.getTime() - start.getTime()) + " ms");
    }
};