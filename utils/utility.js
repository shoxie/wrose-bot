let request = require("request");
let cheerio = require("cheerio");
let config = require("../config/config.json");
const fs = require("fs");
const convert = require("xml-js");
const Discord = require("discord.js");
const moment = require("moment");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
function sendResponse(message) {
  const args = message.content
    .slice(config.prefix.length)
    .trim()
    .split(/ +/g);
  let query = encodeURIComponent(args.join(" "));
  request(`https://some-random-api.ml/chatbot?message=${query}`, function(
    error,
    response,
    body
  ) {
    if (error) console.log(error);
    let data = JSON.parse(body);
    if (!data) console.log("no data");
    if (data) {
      message.channel.send(data.response);
    }
  });
}
function validateUser(message) {
  for (let key in config.ownerID) {
    if (message.member.id === config.ownerID[key]) return true;
  }
  return false;
}
function sendShit(message) {
  message.channel.send(`https://discord.gg/grd5J3K`);
}

String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function sendNews(msg) {
  fs.readFile("./newsData.json", async function readFileCallback(err, data) {
    data = JSON.parse(data);
    var key1, sendData;
    for (const key of Object.keys(data)) {
      if (data[key].Actived == false) {
        key1 = key;
      }
    }
    if (key1) {
      data[key1].Actived = true;
      sendData = data[key1];
    }
    if (sendData) {
      fs.writeFile("./newsData.json", JSON.stringify(data), "", err => {});
      var { link, desc } = convert_data(sendData.description._cdata);
      let title = sendData.title._text ? sendData.title._text : "Article";
      const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(getRandomColor())
        .setDescription(desc)
        .setURL(link)
        .setTimestamp(sendData.pubDate._text)
        .setFooter("VNEXPRESS");

      await msg.channel.send(embed);
    }
  });
}

function updateNews() {
  request("https://vnexpress.net/rss/tin-moi-nhat.rss", function(
    err,
    response,
    body
  ) {
    if (err) console.log(err);
    var result1 = convert.xml2js(body, { compact: true, spaces: 4 });
    var dataTmp = result1.rss.channel.item;
    for (const key of Object.keys(dataTmp)) {
      dataTmp[key].Actived = false;
    }
    if (!fs.existsSync("./newsData.json")) {
      //  Nếu chưa tồn tại tạo file  mới
      fs.writeFile("./newsData.json", JSON.stringify(dataTmp), "", err => {
        if (err) throw err;
        console.log("Tạo file newsData.json thành công!");
      });
      return;
    }

    fs.readFile("./newsData.json", function readFileCallback(err, data) {
      if (err) {
        console.log("Đọc file newsData.json thất bại!");
        return;
      } else {
        var obj = JSON.parse(data);
        var ifNew = false;
        var del = 0,
          add = 0;
        for (const key1 of Object.keys(dataTmp)) {
          var check = false;
          for (const key2 of Object.keys(obj)) {
            if (obj[key2].title._text == dataTmp[key1].title._text)
              check = true;
          }
          if (!check) {
            obj.push(dataTmp[key1]);
            ifNew = true;
            add++;
          }
        }

        cleanData(obj, function(delData, ifNewData) {
          del += delData;
          ifNew = ifNew || ifNewData;
        });

        if (ifNew)
          fs.writeFile("./newsData.json", JSON.stringify(obj), "", err => {
            if (err) throw err;
            console.log(
              `Cập nhật newsData.json thành công!\n Thêm ${add} tin. Xóa ${del} tin. Tổng tin: ${obj.length}\n`
            );
          });
      }
    });
  });
}

function convert_data(data) {
  const $ = cheerio.load(data);
  var link = $("a")
    .first()
    .attr("href");
  const dom = new JSDOM('<img src="i-vnexpress.vnecdn.net">', {
    includeNodeLocations: true
  });
  var thumnail = dom.window.document.querySelector("img").getAttribute("src");
  var desc = $.text();
  return { link, desc, thumnail };
}

function cleanData(obj, callback) {
  var key = obj.length;
  var del = 0;
  ifNew = false;
  while (key--) {
    if (obj[key]) {
      var date = Date.parse(obj[key].pubDate._text);
      if ((Date.now() - date) / (60 * 60 * 24 * 1000) >= 24 / 24) {
        obj.splice(key, 1);
        ifNew = true;
        del++;
      }
    }
  }
  callback(del, ifNew);
}

function getChess(data, msg) {
  if (checkSteam(data)) {
    request(config.getID64URL + data, function(err, response, body) {
      if (err) throw err;
      body = JSON.parse(body).response;
      if (body.success == 1) {
        var steamID64 = body.steamid;
        sendATC(steamID64, msg);
      } else msg.channel.send("```ERROR, CANT FIND USER\nPLEASE USE USERNAME OR STEAMID```");
    });
  } else sendATC(data, msg);
}

function sendATC(steamID, msg) {
  request(config.getDAC + steamID64toSteamID32(steamID) + "/overview", function(
    err,
    response,
    body
  ) {
    if (err) throw err;
    var body = JSON.parse(body).data;
    if (body) {
      getUsername(steamID, function(username, avatarLink) {
        const embed = new Discord.MessageEmbed()
          .setTitle(`Stats for ${username} :`)
          .setColor(getRandomColor())
          .setThumbnail(avatarLink)
          .addField(
            ":globe_with_meridians: Rank/Max Rank :",
            getRank(body.current_level) + "/" + getRank(body.highest_level),
            true
          )
          .addField(
            ":100: Avg Rank In Match :",
            Math.round(body.avg_rank * 100) / 100,
            true
          )
          .addField(":wheel_of_dharma: Total Games :", body.total_games, true)
          .addField(":crown: Top 1 :", body.win_games, true)
          .addField(":small_orange_diamond: Top 3 :", body.top3_games, true)
          .addField(":candy: Total candies :", body.total_candies, true)
          .setFooter("Autochess Stats - autochess.varena.com")
          .setTimestamp(Date.now());
        msg.channel.send(embed);
      });
    } else msg.channel.send("```SORRY,SOMETHING WENT WRONG```");
  });
}

function getUsername(steamID, callback) {
  request(config.getUserInfo + steamID, function(err, response, body) {
    if (err) throw err;
    if (body) {
      body = JSON.parse(body).response.players[0];
      callback(body.personaname, body.avatarfull);
    }
  });
}

function checkSteam(data) {
  return 1 && (data.length !== 17 || parseInt(data) == NaN);
}

function steamID64toSteamID32(steamID64) {
  return Number(steamID64.substr(-16, 16)) - 6561197960265728;
}

function getRank(number) {
  var rank = ["Pawn", "Knight", "Bishop", "Rook", "King", "Queen"];
  var tier = Math.floor(number / 9);
  var num;
  if (tier >= 4) num = "";
  else num = " " + (number % 9 == 0 ? 9 : number % 9);
  return rank[tier] + num;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getStats(username, msg) {
  var user = msg.member;
  const embed = new Discord.MessageEmbed()
    .setTitle(user.displayName)
    .addField(
      "Join date:",
      moment(user.joinedAt).calendar(null, { sameElse: "DD/MM/YYYY" }),
      true
    )
    .addField("Status:", user.presence.status.capitalize(), true)
    .addField("IsBot:", user.user.bot ? "Yes" : "No", true)
    .addField("Total time spend on discord:", "Dunt know :<", true)
    .setThumbnail(user.user.avatarURL)
    .setColor(user.displayHexColor)
    .setTimestamp(Date.now());
  msg.channel.send(embed);
}

function updateCorona(message) {
  request("https://coronavirus-tracker-api.herokuapp.com/all", function(
    error,
    response,
    body
  ) {
    let data = JSON.parse(body);
    message.channel.send({
      embed: {
        color: 14177041,
        title: "Corona(COVID-19) updates",
        fields: [
          {
            name: "Infected",
            value: data.latest.confirmed
          },

          {
            name: "Deaths confirmed",
            value: data.latest.deaths
          },
          {
            name: "Recoverd",
            value: data.latest.recovered
          }
        ]
      }
    });
  });
}
module.exports = {
  sendResponse,
  validateUser,
  sendShit,
  getRandomColor,
  convert_data,
  updateNews,
  sendNews,
  getChess,
  getStats,
  updateCorona
};
