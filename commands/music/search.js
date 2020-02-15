let request = require("request");
let dude = require("yt-dude");
let ytdl = require('ytdl-core')
var fetchVideoInfo = require('youtube-info');
module.exports = {
    config: {
        name: 'search',
        enabled: false,
        usage: 'search [args]'
    },
    async run(client, message, args) {
        console.log(message.member)
    }
};