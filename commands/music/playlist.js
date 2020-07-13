const ytdl = require('ytdl-core')
const dude = require('yt-dude')
const plModel = require('../../model/playlist.model')
const {
  getSongInfo,
  getThumbnail,
  secondsCoverter
} = require('../../utils/utility')
const Pagination = require('discord-paginationembed')
const { redMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'playlist',
    description: 'Add a song to a specific playlist',
    usage: 'playlist [playlist] [url]',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    const messageFlags = args[0]
    if (messageFlags === '--add') {
      if (ytdl.validateURL(args[1])) {
        addPlaylist(args[1])
      } else if (!ytdl.validateURL(args[1])) {
        args.splice(args.indexOf('--add'), 1)
        const query = await dude.search(args.join(' '))
        const videoUrl = 'https://www.youtube.com/watch?v=' + query[0].videoId
        addPlaylist(videoUrl)
      }
    }
    if (messageFlags === '--show') {
      const user = message.mentions.users.first()
        ? message.mentions.users.first().id
        : message.author.id
      const embeds = []
      const songArr = await plModel.getPlaylist(user)
      if (songArr.length === 0) { return redMessage(message, "You don't have any song on your playlist") }
      for (const song of songArr) {
        await embeds.push(song.songName)
      }
      try {
        const playlist = new Pagination.FieldsEmbed()
          .setArray(embeds)
          .setAuthorizedUsers([])
          .setChannel(message.channel)
          .setPageIndicator(true)
          .formatField('Name', (i) => i + '\n')
          .setDeleteOnTimeout(true)
          .setElementsPerPage(10)
          .setEmojisFunctionAfterNavigation(true)
        playlist.embed
          .setThumbnail(
            client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
          )
          .setColor('#0390fc')
          .setFooter('Created by wrose')
        await playlist.build()
      } catch (error) {
        message.channel.send(error.message)
      }
    }
    if (messageFlags === '--delete') {
      args.splice(args.indexOf(messageFlags), 1)
      const deletingSong = args.join(' ')
      try {
        const a = await plModel.deleteSong(deletingSong, message.author.id)
        message.channel.send({
          embed: {
            color: 15158332,
            title: 'Delete one song from ' + message.author.tag + ' playlist',
            fields: [
              {
                name: 'Song name',
                value: a.songName
              },
              {
                name: 'Song URL',
                value: a.link
              }
            ]
          }
        })
      } catch (error) {
        console.log('error', error)
      }
    }
    if (messageFlags === '--destroy') {
      const id = message.author.id
      try {
        const query = await plModel.destroyPlaylist(id)
        console.log(query)
        message.channel.send('Deleted playlist for ' + message.author.tag)
      } catch (error) {
        redMessage(message, error.title, error.message)
      }
    }
    async function addPlaylist (url) {
      try {
        const a = await plModel.addPlaylist(url, message.author.id)
        const songInfo = await getSongInfo(url)
        message.channel.send({
          embed: {
            color: 3447003,
            title: 'Added one song playlist',
            fields: [
              {
                name: 'Song name',
                value: songInfo.title
              },
              {
                name: 'Song URL',
                value: songInfo.video_url
              },
              {
                name: 'Playlist author',
                value: message.author.tag
              }
            ]
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
