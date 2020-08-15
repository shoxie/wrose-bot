const { redMessage } = require('../../utils/message')
const roleModel = require('../../model/role.model')
module.exports = {
  config: {
    name: 'autoRole',
    usage: 'autoRole <roleId>',
    aliases: [],
    description: 'con cac',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    if (!message.member.hasPermission('MANAGE_ROLES')) { return redMessage(message, 'Insufficient permission') }
    const role = message.mentions.roles.first()
      ? message.mentions.roles.first()
      : message.guild.roles.cache.get(args[0])
    if (!role) return redMessage(message, 'Include a role id or tag the role you want to be auto given')
    if (args.includes('--remove')) {
      const toRemove = await roleModel.remove(role.id, message.guild.id, 'auto')
      return message.channel.send('Removed')
    } else {
      const toAdd = await roleModel.add(role.id, message.guild.id, 'auto')
      return message.channel.send('Added')
    }
  }
}
