let request = require("request");
let cheerio = require('cheerio')
module.exports = {
    config: {
        name: "lyrics",
        usage: "lyrics [song name]",
        description: "Show lyrics for requested song.",
        enabled: true
    },
    async run(client, message, args) {
        var replacedString = JSON.stringify(args);
        replacedString = replacedString.replace(/ /g, "%20");
        const query = replacedString;
        const options = {
            method: "GET",
            url: "https://api.genius.com/search",
            qs: {
                q: query,
                access_token: "ZilEYmeGT3qw_4Sfz3qOCnejUa1Jsbvogq55JoCqNw233YpyAUj779BFdgmGv6Wv"
            }
        };
        request(options, function (error, response, body) {
            const hits = JSON.parse(body).response.hits;
            // console.log(hits[0].result.url);
            let url = hits[0].result.url;
            request(url, function (error, reponse, body) {
                let $ = cheerio.load(body)
                //console.log($('p').first().text().trim())
                let lyrics = $('p').first().eq(0).text().trim().split('\n')
                var myfields = [];
                var tmp = 0;
                var sttmp = '';
                for (var i = 0; i <= lyrics.length; i++) {
                    sttmp += lyrics[i] + ' \n ';
                    tmp++;
                    if (tmp == 15) {
                        myfields.push({
                            name: '------------------------------------------------',
                            value: sttmp
                        });
                        tmp = 0;
                        sttmp = '';
                    }
                };
                //console.log(typeof myfields)
                message.channel.send({
                    embed: {
                        color: 3447003,
                        fields: myfields,
                        footer: {
                            text: 'Powered by Genius\t\t\t\t\t\t\t\t\t\t\tCreated by wrose',
                            icon_url: 'https://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png'
                        },
                        thumbnail: {
                            url: client.user.avatarURL
                        }
                    }
                })
            })
        });
    }
};