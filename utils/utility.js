const request = require('request')
const cheerio = require('cheerio')
const config = require('../config/config.json')
const fs = require('fs')
const convert = require('xml-js')
const Discord = require('discord.js')
const moment = require('moment')
const jsdom = require('jsdom')
const { createCanvas } = require('canvas')
const { JSDOM } = jsdom
const getVideoId = require('get-video-id')
const ytdl = require('ytdl-core')
const startWords = require('../assets/json/word-list.json')
const send = require('gmail-send')({
  user: 'minzycrackteam@gmail.com',
  pass: 'kjbarjuidzcevgcn',
  to: 'sktt1lka@gmail.com',
  subject: 'Error on DiscordBot',
  text: 'Error happened'
})
const yts = require('yt-search')
function sendResponse (message) {
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g)
  const query = encodeURIComponent(args.join(' '))
  request(`https://some-random-api.ml/chatbot?message=${query}`, function (
    error,
    response,
    body
  ) {
    if (error) console.log(error)
    const data = JSON.parse(body)
    if (!data) console.log('no data')
    if (data) {
      message.channel.send(data.response)
    }
  })
}
function validateUser (message) {
  for (const key in config.ownerID) {
    if (message.member.id === config.ownerID[key]) return true
  }
  return false
}
function sendShit (message) {
  message.channel.send('https://discord.gg/grd5J3K')
}

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1)
}

function sendNews (msg) {
  fs.readFile('./newsData.json', async function readFileCallback (err, data) {
    data = JSON.parse(data)
    var key1, sendData
    for (const key of Object.keys(data)) {
      if (data[key].Actived == false) {
        key1 = key
      }
    }
    if (key1) {
      data[key1].Actived = true
      sendData = data[key1]
    }
    if (sendData) {
      fs.writeFile('./newsData.json', JSON.stringify(data), '', (err) => {})
      var { link, desc } = convert_data(sendData.description._cdata)
      const title = sendData.title._text ? sendData.title._text : 'Article'
      const embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setColor(getRandomColor())
        .setDescription(desc)
        .setURL(link)
        .setTimestamp(sendData.pubDate._text)
        .setFooter('VNEXPRESS')

      await msg.channel.send(embed)
    }
  })
}

function updateNews () {
  request('https://vnexpress.net/rss/tin-moi-nhat.rss', function (
    err,
    response,
    body
  ) {
    if (err) console.log(err)
    var result1 = convert.xml2js(body, { compact: true, spaces: 4 })
    var dataTmp = result1.rss.channel.item
    for (const key of Object.keys(dataTmp)) {
      dataTmp[key].Actived = false
    }
    if (!fs.existsSync('./newsData.json')) {
      //  Nếu chưa tồn tại tạo file  mới
      fs.writeFile('./newsData.json', JSON.stringify(dataTmp), '', (err) => {
        if (err) throw err
        console.log('Tạo file newsData.json thành công!')
      })
      return
    }

    fs.readFile('./newsData.json', function readFileCallback (err, data) {
      if (err) {
        console.log('Đọc file newsData.json thất bại!')
      } else {
        var obj = JSON.parse(data)
        var ifNew = false
        var del = 0
        var add = 0
        for (const key1 of Object.keys(dataTmp)) {
          var check = false
          for (const key2 of Object.keys(obj)) {
            if (obj[key2].title._text == dataTmp[key1].title._text) { check = true }
          }
          if (!check) {
            obj.push(dataTmp[key1])
            ifNew = true
            add++
          }
        }

        cleanData(obj, function (delData, ifNewData) {
          del += delData
          ifNew = ifNew || ifNewData
        })

        if (ifNew) {
          fs.writeFile('./newsData.json', JSON.stringify(obj), '', (err) => {
            if (err) throw err
            console.log(
              `Cập nhật newsData.json thành công!\n Thêm ${add} tin. Xóa ${del} tin. Tổng tin: ${obj.length}\n`
            )
          })
        }
      }
    })
  })
}

function convert_data (data) {
  const $ = cheerio.load(data)
  var link = $('a').first().attr('href')
  const dom = new JSDOM('<img src="i-vnexpress.vnecdn.net">', {
    includeNodeLocations: true
  })
  var thumnail = dom.window.document.querySelector('img').getAttribute('src')
  var desc = $.text()
  return { link, desc, thumnail }
}

function cleanData (obj, callback) {
  var key = obj.length
  var del = 0
  ifNew = false
  while (key--) {
    if (obj[key]) {
      var date = Date.parse(obj[key].pubDate._text)
      if ((Date.now() - date) / (60 * 60 * 24 * 1000) >= 24 / 24) {
        obj.splice(key, 1)
        ifNew = true
        del++
      }
    }
  }
  callback(del, ifNew)
}

function getChess (data, msg) {
  if (checkSteam(data)) {
    request(config.getID64URL + data, function (err, response, body) {
      if (err) throw err
      body = JSON.parse(body).response
      if (body.success == 1) {
        var steamID64 = body.steamid
        sendATC(steamID64, msg)
      } else msg.channel.send('```ERROR, CANT FIND USER\nPLEASE USE USERNAME OR STEAMID```')
    })
  } else sendATC(data, msg)
}

function sendATC (steamID, msg) {
  request(
    config.getDAC + steamID64toSteamID32(steamID) + '/overview',
    function (err, response, body) {
      if (err) throw err
      var body = JSON.parse(body).data
      if (body) {
        getUsername(steamID, function (username, avatarLink) {
          const embed = new Discord.MessageEmbed()
            .setTitle(`Stats for ${username} :`)
            .setColor(getRandomColor())
            .setThumbnail(avatarLink)
            .addField(
              ':globe_with_meridians: Rank/Max Rank :',
              getRank(body.current_level) + '/' + getRank(body.highest_level),
              true
            )
            .addField(
              ':100: Avg Rank In Match :',
              Math.round(body.avg_rank * 100) / 100,
              true
            )
            .addField(':wheel_of_dharma: Total Games :', body.total_games, true)
            .addField(':crown: Top 1 :', body.win_games, true)
            .addField(':small_orange_diamond: Top 3 :', body.top3_games, true)
            .addField(':candy: Total candies :', body.total_candies, true)
            .setFooter('Autochess Stats - autochess.varena.com')
            .setTimestamp(Date.now())
          msg.channel.send(embed)
        })
      } else msg.channel.send('```SORRY,SOMETHING WENT WRONG```')
    }
  )
}

function getUsername (steamID, callback) {
  request(config.getUserInfo + steamID, function (err, response, body) {
    if (err) throw err
    if (body) {
      body = JSON.parse(body).response.players[0]
      callback(body.personaname, body.avatarfull)
    }
  })
}

function checkSteam (data) {
  return 1 && (data.length !== 17 || parseInt(data) == NaN)
}

function steamID64toSteamID32 (steamID64) {
  return Number(steamID64.substr(-16, 16)) - 6561197960265728
}

function getRank (number) {
  var rank = ['Pawn', 'Knight', 'Bishop', 'Rook', 'King', 'Queen']
  var tier = Math.floor(number / 9)
  var num
  if (tier >= 4) num = ''
  else num = ' ' + (number % 9 == 0 ? 9 : number % 9)
  return rank[tier] + num
}

function getRandomColor () {
  var letters = '0123456789ABCDEF'
  var color = '#'
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

function getStats (username, msg) {
  var user = msg.member
  const embed = new Discord.MessageEmbed()
    .setTitle(user.displayName)
    .addField(
      'Join date:',
      moment(user.joinedAt).calendar(null, { sameElse: 'DD/MM/YYYY' }),
      true
    )
    .addField('Status:', user.presence.status.capitalize(), true)
    .addField('IsBot:', user.user.bot ? 'Yes' : 'No', true)
    .addField('Total time spend on discord:', 'Dunt know :<', true)
    .setThumbnail(user.user.avatarURL)
    .setColor(user.displayHexColor)
    .setTimestamp(Date.now())
  msg.channel.send(embed)
}

function updateCorona (message) {
  request('https://coronavirus-tracker-api.herokuapp.com/all', function (
    error,
    response,
    body
  ) {
    const data = JSON.parse(body)
    message.channel.send({
      embed: {
        color: 14177041,
        title: 'Corona(COVID-19) updates',
        fields: [
          {
            name: 'Infected',
            value: data.latest.confirmed
          },

          {
            name: 'Deaths confirmed',
            value: data.latest.deaths
          },
          {
            name: 'Recoverd',
            value: data.latest.recovered
          }
        ]
      }
    })
  })
}
async function verify (channel, user, time = 30000) {
  const yes = ['yes', 'y', 'ye', 'yeah', 'yup', 'yea', 'ya']
  const no = ['no', 'n', 'nah', 'nope', 'nop']
  const filter = (res) => {
    const value = res.content.toLowerCase()
    return (
      (user ? res.author.id === user.id : true) &&
      (yes.includes(value) || no.includes(value))
    )
  }
  const verify = await channel.awaitMessages(filter, {
    max: 1,
    time
  })
  if (!verify.size) return 0
  const choice = verify.first().content.toLowerCase()
  if (yes.includes(choice)) return true
  if (no.includes(choice)) return false
  return false
}
async function verifyWord (word) {
  if (startWords.includes(word.toLowerCase())) return true
  try {
    const { body } = await request
      .get(
        `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}`
      )
      .query({ key: 'd1bc37f2-10d5-4b0e-9171-54d13e7b7475' })
    if (!body.length) return false
    return true
  } catch (err) {
    if (err.status === 404) return false
    return null
  }
}
function delay (ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
function shortenText (ctx, text, maxWidth) {
  let shorten = false
  while (ctx.measureText(text).width > maxWidth) {
    if (!shorten) shorten = true
    text = text.substr(0, text.length - 1)
  }
  return shorten ? `${text}...` : text
}
function list (arr, conj = 'and') {
  const len = arr.length
  return `${arr.slice(0, -1).join(', ')}${
    len > 1 ? `${len > 2 ? ',' : ''} ${conj} ` : ''
  }${arr.slice(-1)}`
}
function silhouette (ctx, x, y, width, height) {
  const data = ctx.getImageData(x, y, width, height)
  for (let i = 0; i < data.data.length; i += 4) {
    data.data[i] = 0
    data.data[i + 1] = 0
    data.data[i + 2] = 0
  }
  ctx.putImageData(data, x, y)
  return ctx
}
function invert (ctx, x, y, width, height) {
  const data = ctx.getImageData(x, y, width, height)
  for (let i = 0; i < data.data.length; i += 4) {
    data.data[i] = 255 - data.data[i]
    data.data[i + 1] = 255 - data.data[i + 1]
    data.data[i + 2] = 255 - data.data[i + 2]
  }
  ctx.putImageData(data, x, y)
  return ctx
}
function centerImage (base, data) {
  const dataRatio = data.width / data.height
  const baseRatio = base.width / base.height
  let { width, height } = data
  let x = 0
  let y = 0
  if (baseRatio < dataRatio) {
    height = data.height
    width = base.width * (height / base.height)
    x = (data.width - width) / 2
    y = 0
  } else if (baseRatio > dataRatio) {
    width = data.width
    height = base.height * (width / base.width)
    x = 0
    y = (data.height - height) / 2
  }
  return { x, y, width, height }
}
function sepia (ctx, x, y, width, height) {
  const data = ctx.getImageData(x, y, width, height)
  for (let i = 0; i < data.data.length; i += 4) {
    const brightness =
      0.34 * data.data[i] + 0.5 * data.data[i + 1] + 0.16 * data.data[i + 2]
    data.data[i] = brightness + 100
    data.data[i + 1] = brightness + 50
    data.data[i + 2] = brightness
  }
  ctx.putImageData(data, x, y)
  return ctx
}
function shorten (text, maxLen = 2000) {
  return text.length > maxLen ? `${text.substr(0, maxLen - 3)}...` : text
}
function trimArray (arr, maxLen = 10) {
  if (arr.length > maxLen) {
    const len = arr.length - maxLen
    arr = arr.slice(0, maxLen)
    arr.push(`${len} more...`)
  }
  return arr
}
function sendError (message, error) {
  message.channel.send({
    embed: {
      color: 15158332,
      title: error.name,
      description: error.message
    }
  })
}
async function getSongInfo (url) {
  try {
    const data = await ytdl.getInfo(url)
    return data
  } catch (error) {
    console.log(error)
    sendErrorMail(error)
  }
}
function secondsCoverter (time) {
  console.log(time)
  const second = time.split('.')
  var timestamp = parseInt(second[0])
  var hours = Math.floor(timestamp / 60 / 60)
  var minutes = Math.floor(timestamp / 60) - hours * 60
  var seconds = timestamp % 60
  if (hours > 0) {
    return hours + ':' + minutes + ':' + seconds
  } else return minutes + ':' + seconds
}
function getThumbnail (url) {
  const ids = getVideoId(url)
  return `http://img.youtube.com/vi/${ids.id}/maxresdefault.jpg`
}
function shuffleArray (array) {
  let m = array.length
  let t
  let i
  while (m) {
    i = Math.floor(Math.random() * m--)
    t = array[m]
    array[m] = array[i]
    array[i] = t
  }
  return array
}
function sendErrorMail (error) {
  // const filepath = "log.txt";
  send(
    {
      subject: 'attached ',
      text: `${error.name} \n` + `${error.message}`
    },
    function (err, res, full) {
      if (err) return console.log('send() callback returned: err:', err)
      console.log('send() callback returned: res:', res)
    }
  )
}
function updatePresence (message, serverQueue) {
  if (serverQueue.isPlaying === true) {
    message.member.guild.channels.cache
      .find((x) => x.id === serverQueue.textChannel.id)
      .setTopic('Playing ' + serverQueue.queue[0].title)
  }
  if (serverQueue.isPlaying === false) {
    message.member.guild.channels.cache
      .find((x) => x.id === serverQueue.textChannel.id)
      .setTopic('Not playing')
  }
}
function isYT (url) {
  const y = /(?:youtube\.com\/\S*(?:(?:\/e(?:mbed))?\/|watch\?(?:\S*?&?v\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/g.test(
    url
  )
  return true ? y : false
}
function isSC (url) {
  const s = /((https:\/\/)|(http:\/\/)|(www.)|(m\.)|(\s))+(soundcloud.com\/)+[a-zA-Z0-9\-\.]+(\/)+[a-zA-Z0-9\-\.]+/g.test(
    url
  )
  return true ? s : false
}
function formatNumber (number) {
  return number.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
async function getvideourl (args) {
  const r = await yts(args)
  if (r) return r.videos[0].url
  else return null
}
function removeAccents (str) {
  var AccentsMap = [
    'aàảãáạăằẳẵắặâầẩẫấậ',
    'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬ',
    'dđ',
    'DĐ',
    'eèẻẽéẹêềểễếệ',
    'EÈẺẼÉẸÊỀỂỄẾỆ',
    'iìỉĩíị',
    'IÌỈĨÍỊ',
    'oòỏõóọôồổỗốộơờởỡớợ',
    'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢ',
    'uùủũúụưừửữứự',
    'UÙỦŨÚỤƯỪỬỮỨỰ',
    'yỳỷỹýỵ',
    'YỲỶỸÝỴ'
  ]
  for (var i = 0; i < AccentsMap.length; i++) {
    var re = new RegExp('[' + AccentsMap[i].substr(1) + ']', 'g')
    var char = AccentsMap[i][0]
    str = str.replace(re, char)
  }
  return str
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
  updateCorona,
  verify,
  verifyWord,
  delay,
  shortenText,
  list,
  silhouette,
  invert,
  centerImage,
  sepia,
  shorten,
  trimArray,
  sendError,
  getSongInfo,
  secondsCoverter,
  getThumbnail,
  sendErrorMail,
  updatePresence,
  isYT,
  isSC,
  shuffleArray,
  formatNumber,
  getvideourl,
  removeAccents
}
