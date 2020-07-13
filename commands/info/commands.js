const Discord = require('discord.js')
const conf = require('../../config/config.json')
const Pagination = require('discord-paginationembed')
const { MessageEmbed } = require('discord.js')
module.exports = {
  config: {
    name: 'commands',
    usage: 'commands',
    description: 'Show available commands',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    // let embed = new Discord.MessageEmbed()
    //   .setColor("#0390fc")
    //   .setTitle("Commands that i can execute")
    //   .setThumbnail(
    //     client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
    //   )
    //   .setFooter("Created by wrose");
    // client.commands.forEach(command => {
    //   let status = command.config.enabled ? "✅" : "❌";
    //   let value = `${conf.prefix}${command.config.usage}` + " " + `${status}`;
    //   embed.addField(command.config.name, value);
    // });
    // message.channel.send(embed);
    const embeds = []

    client.commands.forEach(command => {
      const status = command.config.enabled ? '✅' : '❌'
      const value = `${conf.prefix}${command.config.usage}` + ' ' + `${status}`
      const data = {
        name: command.config.name,
        usage: command.config.usage,
        status: status
      }
      embeds.push(data)
    })
    embeds.sort(function (a, b) {
      var textA = a.name
      var textB = b.name
      return textA < textB ? -1 : textA > textB ? 1 : 0
    })
    const commands = new Pagination.FieldsEmbed()
      .setArray(embeds)
      .setAuthorizedUsers([])
      .setChannel(message.channel)
      .setPageIndicator(true)
      .formatField('Name', i => i.name + '\n')
      .formatField('Usage', i => i.usage + '\n')
      .formatField('Status', i => i.status + '\n')
      .setDeleteOnTimeout(true)
      .setElementsPerPage(10)
      .setEmojisFunctionAfterNavigation(true)
    commands.embed
      .setThumbnail(
        client.user.avatarURL({ format: 'png', dynamic: true, size: 1024 })
      )
      .setColor('#0390fc')
      .setFooter('Created by wrose')
    await commands.build()
  }
}
