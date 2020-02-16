let request = require("request");
let dude = require("yt-dude");
let ytdl = require('ytdl-core')
var fetchVideoInfo = require('youtube-info');
module.exports = {
    config: {
        name: 'search',
        usage: 'search [args]',
        description: 'Honestly this is my dev test command',
        enabled: false
    },
    async run(client, message, args) {
        console.log(message.member)
    }
};