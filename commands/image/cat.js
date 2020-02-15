let request = require("request-promise-native");
let cheerio = require("cheerio");
module.exports = {
    config: {
        name: "cat",
        usage: "Show random cat images",
        enabled: true
    },
    async run(client, message, args) {
        let options = {
            method: "HEAD",
            url: "https://thecatapi.com/api/images/get",
            followAllRedirects: true,
            resolveWithFullResponse: true
        };
        // request(options).then(function (body) {
        //     //console.log(body.request.headers.referer);
        //     message.channel.send({
        //         embed: {
        //             color: 3447003,
        //             image: {
        //                 url: body.request.headers.referer
        //             }
        //         }
        //     })
        // });
        var r = request(options.url, function (e, response) {
            //console.log(response.request.uri.Url.href);
        });
        request(options).then(function (body) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    image: {
                        url: r.uri.href
                    }
                }
            });
        });
    }
};