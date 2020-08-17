const { sendSongQueue, sendPlaying, emptyQueue } = require('./message')
const { updatePresence, sendErrorMail } = require('./utility')
const Pagination = require('discord-paginationembed')
const ytcore = require('ytdl-core')
const stations = require('../data/stations.json')
const request = require('request-promise')
const cheerio = require('cheerio')
const play = (client, message, station) => {
  const serverQueue = client.queue.get(message.guild.id)
  console.log(serverQueue)
  if (!serverQueue.queue[0]) {
    serverQueue.isPlaying = false
    updatePresence(message, serverQueue)
    serverQueue.voiceChannel.leave()
    emptyQueue(message, client)
    client.queue.delete(guild)
  } else {
    sendPlaying(message, client)
    serverQueue.dispatcher = serverQueue.connection
      .play(serverQueue.queue[0].url, {
        filter: 'audioonly',
        quality: 'highestaudio',
        highWaterMark: 1 << 25,
        encoderArgs: ['-af', 'equalizer=f=40:width_type=h:width=50:g=50']
      })
      // serverQueue.dispatcher = serverQueue.connection
      //   .play(await ytDiscord(serverQueue.queue[0].url), { type: "opus" })
      .on('start', () => {
        serverQueue.isPlaying = true
        updatePresence(message, serverQueue)
      })
      .on('finish', () => {
        console.log('stop playing')
        serverQueue.queue.shift()
        play(message.guild.id)
      })
      .on('volumeChange', (oldVolume, newVolume) => {
        message.channel.send({
          embed: {
            title: `Volume changed from ${oldVolume} to ${newVolume}.`,
            author: {
              name: message.client.user.username,
              icon_url: message.client.user.avatarURL({
                format: 'png',
                dynamic: true,
                size: 1024
              })
            }
          }
        })
      })
      .on('end', () => {
        serverQueue.queue.shift()
      })
      .on('error', (error) => {
        console.log(error)
        sendErrorMail(error)
      })
  }
}
const stop = (client, message) => {
  const serverQueue = client.queue.get(message.guild.id)
  if (!serverQueue) return message.reply('Not playing radio stream')
  if (!serverQueue.radio) message.reply('Use skip command please')
  try {
    serverQueue.dispatcher.destroy()
    serverQueue.voiceChannel.leave()
    client.queue.delete(message.guild.id)
  } catch (error) {
    console.log(error)
  }
}
const showStations = async (client, message) => {
  const embeds = []
  for (const station of Object.keys(stations)) {
    const data = {
      name: station
    }
    embeds.push(data)
  }
  const infor = new Pagination.FieldsEmbed()
    .setArray(embeds)
    .setAuthorizedUsers([])
    .setChannel(message.channel)
    .setPageIndicator(true)
    .formatField('Name', (i) => i.name + '\n')
    .setDeleteOnTimeout(true)
    .setElementsPerPage(10)
    .setEmojisFunctionAfterNavigation(true)
  infor.embed
    .setThumbnail(
      client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
    )
    .setColor('#0390fc')
    .setFooter('Created by wrose')
  await infor.build()
}

const getLyrics = async (args) => {
  try {
    const a = await request(`https://some-random-api.ml/lyrics?title=${args}`)

    const data = JSON.parse(a)

    if (data.error) {
      data = await getLyricsFromGenius()
      return
    }
    var output = data.lyrics.split('\n')
    var myfields = []
    var tmp = 0
    var sttmp = ''
    for (var i = 0; i <= output.length; i++) {
      sttmp += output[i] + ' \n '
      tmp++
      if (tmp == 15) {
        myfields.push({ name: '\u200B', value: sttmp })
        tmp = 0
        sttmp = ''
      }
    }

    return [data, myfields]
  } catch (error) {
    console.log(error.stack)
  }
}
const getLyricsFromGenius = async (args) => {
  var replacedString = JSON.stringify(args)
  replacedString = replacedString.replace(/ /g, '%20')
  const options = {
    method: 'GET',
    url: 'https://api.genius.com/search',
    qs: {
      q: replacedString,
      access_token:
            'ZilEYmeGT3qw_4Sfz3qOCnejUa1Jsbvogq55JoCqNw233YpyAUj779BFdgmGv6Wv'
    }
  }
  request(options, function (error, reponse, body) {
    if (error) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: '__***Shit***__',
          description: 'Something gone wrong'
        }
      })
    }
    const hits = JSON.parse(body).response.hits
    const $ = cheerio.load(body)
    const lyrics = $('p').first().eq(0).text().trim().split('\n')
    if (lyrics.length === 1) {
      return message.channel.send({
        embed: {
          color: 15158332,
          title: "I can't find that song."
        }
      })
    }
    var myfields = []
    var tmp = 0
    var sttmp = ''
    for (var i = 0; i <= lyrics.length; i++) {
      sttmp += lyrics[i] + ' \n '
      tmp++
      if (tmp == 15) {
        myfields.push({
          name: '------------------------------------------------',
          value: sttmp
        })
        tmp = 0
        sttmp = ''
      }
    }
    message.channel.send({
      embed: {
        color: 3447003,
        fields: myfields
      }
    })
  })
}
module.exports = {
  play,
  stop,
  showStations,
  getLyrics
}
