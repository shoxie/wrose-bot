const Discord = require('discord.js')

module.exports = {
  config: {
    name: 'info',
    aliases: [],
    category: 'millionaire',
    description: 'Info of this game',
    //   usage: '[command]',
    enabled: true,
    ownerOnly: false
  },
  run: async (client, message, args) => {
    const game = message.guild.game
    const state = game ? game.state : null
    if (state == null || state == 'preInit') {
      message.reply('game not setup yet')
      return
    }
    const currentQuestion = game.currentQuestion
    const totalQuestion = game.config.numberQuestions
    const playersList = game
      .getTopPlayer()
      .map(e => `${e.currentQuestion} ${e.user} ${e.alive ? '✅' : ':x:'}\n`)
    await message.channel.send(
      new Discord.MessageEmbed()
        .setColor('#28f7dc')
        .setTitle('Thông tin')
        .setTimestamp()
        .addField('Câu hỏi hiện tại:', currentQuestion + '/' + totalQuestion)
        .addField('Danh sách người chơi:', playersList)
    )
  }
}
