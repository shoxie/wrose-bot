const sendSongQueue = (message, client) => {
  const serverQueue = client.queue.get(message.guild.id)
  message.channel.send({
    embed: {
      color: 3066993,
      title: 'Queue added',
      url: serverQueue.queue[serverQueue.queue.length - 1].url,
      description: serverQueue.queue[serverQueue.queue.length - 1].title,
      thumbnail: {
        url: serverQueue.queue[serverQueue.queue.length - 1].thumbnail
      },
      footer: {
        text:
          'Duration ' +
          serverQueue.queue[serverQueue.queue.length - 1].duration
      }
    }
  })
}
const sendPlaying = (message, client) => {
  const serverQueue = client.queue.get(message.guild.id)
  message.channel.send({
    embed: {
      color: 3447003,
      title: 'Playing',
      url: serverQueue.queue[0].url,
      description: serverQueue.queue[0].title,
      thumbnail: {
        url: serverQueue.queue[0].thumbnail
      },
      footer: {
        text: 'Duration ' + serverQueue.queue[0].duration
      }
    }
  })
}
const emptyQueue = (message) => {
  message.channel.send({
    embed: {
      color: 15158332,
      title: 'No songs in the queue',
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
}
const redMessage = (message, title, description = null) => {
  message.channel.send({
    embed: {
      color: 15158332,
      title: title,
      description: description,
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
}
const blueMessage = (message, title, description = null) => {
  message.channel.send({
    embed: {
      color: 3447003,
      title: title,
      description: description,
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
}
const sendLyrics = async (message, lyrics) => {
  var output = lyrics.split('\n')
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
}
module.exports = {
  sendSongQueue,
  sendPlaying,
  emptyQueue,
  blueMessage,
  redMessage
}
