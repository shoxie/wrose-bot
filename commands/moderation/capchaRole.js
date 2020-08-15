const roleModel = require('../../model/role.model')
const { redMessage } = require('../../utils/message')

module.exports = {
  config: {
    name: 'capchaRole',
    usage: 'capchaRole',
    aliases: [],
    description: '',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    if (!message.member.hasPermission('MANAGE_ROLES')) { return redMessage(message, 'Insufficient permission') }
    const role = message.mentions.roles.first()
      ? message.mentions.roles.first()
      : message.guild.roles.cache.get(args[0])
    if (!role) {
      const pretoGet = await roleModel.getByType('capcha')
      const guildrole = message.guild.roles.cache.find(
        (x) => x.id === pretoGet[0].roleID
      )
      message.channel.send({
        embed: {
          title: 'Existing capcha role',
          fields: [
            {
              name: 'Role name',
              value: guildrole.name
            },
            {
              name: 'Role id',
              value: guildrole.id
            }
          ]
        }
      })
      return redMessage(
        message,
        'Include a role id or tag the role you want to be auto given'
      )
    }

    if (args.includes('--remove')) {
      const toRemove = await roleModel.remove(
        role.id,
        message.guild.id,
        'capcha'
      )
      return message.channel.send('Removed')
    } else {
      const toGet = await roleModel.get(role.id, message.guild.id, 'capcha')
      if (toGet.length === 0) {
        const toAdd = await roleModel.add(role.id, message.guild.id, 'capcha')
        return message.channel.send('Added')
      }
    }
  }
}
