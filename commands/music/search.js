let request = require("request");
let dude = require("yt-dude");
module.exports = {
    name: "search",
    async run(message, args) {
        dude.search(args[0]).then(result => {
            console.log(result[0].videoId)
        })
    }
};