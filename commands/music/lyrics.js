let request = require("request");
let cheerio = require("cheerio");
module.exports = {
    config: {
        name: "lyrics",
        usage: "lyrics [song name]",
        description: "Show lyrics for requested song.",
        enabled: true
    },
    async run(client, message, args) {
        const query = encodeURIComponent(args.join(" "));
        let msg = await message.channel.send(`Searching. . .`)
        request(
            `https://some-random-api.ml/lyrics?title=${query}`,
            function (error, response, body) {
                if (error) return geniusLyrics();

                let data = JSON.parse(body);
                if (data.error) return message.channel.send({
                    embed: {
                        color: 15158332,
                        title: 'I can\'t find that song.'
                    }
                })
                if (data.lyrics.length >= 2048) {
                    var cut = data.lyrics.length - 2000;
                    data.lyrics = data.lyrics.slice(0, 0 - cut) + "..."
                }
                message.channel.send({
                    embed: {
                        color: 3447003,
                        title: 'Lyrics for requested song',
                        url: data.links.genius,
                        fields: [{
                                name: 'Song name',
                                value: data.title
                            },
                            {
                                name: 'Author',
                                value: data.author
                            }
                        ],
                        description: data.lyrics,
                        image: {
                            url: data.thumbnail.genius
                        },
                        footer: {
                            text: 'Powered by Genius\t\t\t\t\t\t\t\t\t\t\tCreated by wrose',
                            icon_url: 'https://images.genius.com/8ed669cadd956443e29c70361ec4f372.1000x1000x1.png'
                        },
                        thumbnail: {
                            url: client.user.avatarURL
                        }
                    }
                })


            }
        );

        function geniusLyrics() {
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
                let url = hits[0].result.url;
                request(url, function (error, reponse, body) {
                    let $ = cheerio.load(body)
                    let lyrics = $('p').first().eq(0).text().trim().split('\n');
                    if (lyrics.length >= 2048) {
                        var cut = lyrics.length - 2000;
                        lyrics = lyrics.slice(0, 0 - cut) + "..."
                    }
                    message.channel.send({
                        embed: {
                            color: 3447003,
                            title: 'Lyrics for requested song',
                            description: lyrics
                        }
                    })
                });
            });
        }
    }
};