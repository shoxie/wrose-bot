const { verify } = require("../../utils/utility");
const request = require("request-promise-native");
const cheerio = require("cheerio");
const fetch = require("node-fetch");
const yts = require("yt-search");
const { removeAccents } = require("../../utils/utility");
module.exports = {
  config: {
    name: "songSearch",
    usage: "songSearch [lyrics]",
    aliases: [],
    description: "Search for a song by lyrics. use --v for vietnamese",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    if (args.includes("--v")) return vietnamSongs();
    let params = encodeURIComponent(args.join(" "));
    let url = "https://songsear.ch/q/" + params;
    fetch(url)
      .then((res) => res.text())
      .then(async (body) => {
        let $ = cheerio.load(body);
        var songName = $("div.head > h2 > a").first().text();
        var songArtist = $("div.head > h3 > b").first().text();
        let shortLyrics = $("div.fragments > p").first().text();
        shortLyrics.replace(args.join(" "), `**${args.join(" ")}**`);
        let r = await yts(songName);
        if (!r) return message.reply("I don't know");
        message.channel.send({
          embed: {
            color: 3447003,
            title: "My guess",
            fields: [
              {
                name: "Song title",
                value: songName + " by " + songArtist,
              },
              {
                name: "URL",
                value: r.videos[0].url,
              },
            ],
            thumbnail: {
              url: r.videos[0].thumbnail,
            },
          },
        });
      });

    // let searchlink = "https://api.audd.io/findLyrics/?q=" + args.join(" ");
    // request(searchlink, async function (error, response, body) {
    //   if (error) return message.reply("Something happened");
    //   console.log(body);
    //   let data = JSON.parse(body);
    //   let media = JSON.parse(data.result[0].media);
    //   console.log(data.result[0]);
    //   message.channel.send({
    //     embed: {
    //       color: 3447003,
    //       title: "My guess",
    //       fields: [
    //         {
    //           name: "Song title",
    //           value: data.result[0].full_title,
    //         },
    //         {
    //           name: "URL",
    //           value: media[0].url,
    //         },
    //       ],
    //     },
    //   });
    //   message.reply("Do you wanna show full lyrics for searched song ?");
    //   const verification = await verify(message.channel, message.author);
    //   if (!verification) return;
    //   var output = lyrics.split("\n");
    //   var myfields = [];
    //   var tmp = 0;
    //   var sttmp = "";
    //   for (var i = 0; i <= output.length; i++) {
    //     sttmp += output[i] + " \n ";
    //     tmp++;
    //     if (tmp == 15) {
    //       myfields.push({ name: "\u200B", value: sttmp });
    //       tmp = 0;
    //       sttmp = "";
    //     }
    //   }
    // });

    async function vietnamSongs() {
      args = args.filter(function (value, index, arr) {
        return value !== "--v";
      });
      let params = args.join("+");
      params = removeAccents(params);
      let url = `https://www.nhaccuatui.com/tim-kiem?q=${params}&b=lyric&s=default&l=tat-ca`;
      console.log(url);
      fetch(url)
        .then((res) => res.text())
        .then(async (body) => {
          let $ = cheerio.load(body);
          let a = $("h3.title_song > a").first().prop("title");
          let b = $("h4.singer_song > a").first().text();
          let r = await yts(a);
          if (!r) return message.reply("I don't know");
          message.channel.send({
            embed: {
              color: 3447003,
              title: "My guess",
              fields: [
                {
                  name: "Song title",
                  value: a + " by " + b,
                },
                {
                  name: "URL",
                  value: r.videos[0].url,
                },
              ],
              thumbnail: {
                url: r.videos[0].thumbnail,
              },
            },
          });
        });
    }
  },
};
