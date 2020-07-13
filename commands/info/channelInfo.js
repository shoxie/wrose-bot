const moment = require('moment')
const { MessageEmbed } = require('discord.js')
const types = {
  dm: 'DM',
  group: 'Group DM',
  text: 'Text Channel',
  voice: 'Voice Channel',
  category: 'Category',
  unknown: 'Unknown'
}

module.exports = {
  config: {
    name: 'channelInfo',
    usage: 'channelInfo',
    aliases: [],
    description: 'Show current channel info',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    let channel
    if (!args[0]) channel = message.channel
    else {
      const temp = message.guild.channels.cache.get(x => x.name === args[0])
      if (!temp) channel = message.channel
      else {
        channel = message.guild.channels.cache.get(x => x.name === args[0])
      }
    }
    const embed = new MessageEmbed()
      .setColor(0x00ae86)
      .addField(
        '❯ Name',
        channel.type === 'dm' ? `@${channel.recipient.username}` : channel.name,
        true
      )
      .addField('❯ ID', channel.id, true)
      .addField('❯ NSFW', channel.nsfw ? 'Yes' : 'No', true)
      .addField(
        '❯ Category',
        channel.parent ? channel.parent.name : 'None',
        true
      )
      .addField('❯ Type', types[channel.type], true)
      .addField(
        '❯ Creation Date',
        moment.utc(channel.createdAt).format('MM/DD/YYYY h:mm A'),
        true
      )
      .addField('❯ Topic', channel.topic || 'None')
    return message.channel.send(embed)
  }
}
