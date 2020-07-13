const { sendError, verify } = require('../../utils/utility')
const { MessageEmbed } = require('discord.js')
const fs = require('fs')
var backups = JSON.parse(fs.readFileSync('./data/backups.json', 'utf8'))

module.exports = {
  config: {
    name: 'backup',
    usage: 'backup [--arguement]',
    description: 'Create a backup version of current Discord server.',
    aliases: [''],
    enabled: true,
    ownerOnly: false
  },
  async run (client, message, args) {
    if (message.author.id !== message.guild.ownerID) { return message.reply('This can only be executed by the server owner') }
    try {
      const info = client.emojis.cache.get('655091815401127966') || 'ℹ️' // https://cdn.discordapp.com/emojis/655091815401127966.png?v=1
      const waiting = client.emojis.cache.get('655695570769412096') || '⌛' // https://images-ext-1.discordapp.net/external/lWj3uW4qvfFB9t0QgGsDJ8vLvh5bSObQ-wwUxYFH4wo/https/images-ext-1.discordapp.net/external/AzWR8HxPJ4t4rPA1DagxJkZsOCOMp4OTgwxL3QAjF4U/https/cdn.discordapp.com/emojis/424900448663633920.gif
      const green = client.emojis.cache.get('655696285286006784') || '✅' // https://images-ext-2.discordapp.net/external/NU9I3Vhi79KV6srTXLJuHxOgiyzmEwgS5nFAbA13_YQ/https/cdn0.iconfinder.com/data/icons/small-n-flat/24/678134-sign-check-512.png
      const error = client.emojis.cache.get('655704809483141141') || '❌' // https://cdn.discordapp.com/emojis/655704809483141141.png?v=1
      const warning = client.emojis.cache.get('656030540310380574') || '⚠️' // https://cdn.discordapp.com/emojis/656030540310380574.png?v=1
      await message.reply('Are you sure you want to backup your server ?')
      const verification = await verify(message.channel, message.author)
      if (!verification) return message.reply('Aborted')
      await message.reply('Creating backup on your server. Please wait ...')
      if (args[0] === 'create' || args[0] === 'c') {
        await message.guild.roles.cache
          .filter(
            (r) =>
              r.name !== message.guild.member(client.user.id).roles.highest.name
          )
          .forEach((r) => {
            if (
              r.comparePositionTo(
                message.guild.member(client.user.id).roles.highest
              ) > 0
            ) {
              return message.channel.send(
                'My role is not the highest role. Aborting...!'
              )
            }
          })

        const creatingEmbed = new MessageEmbed()
          .setTitle(`${waiting}  Please wait ...`)
          .setDescription('Creating backup ... Please wait')
        message.channel.send(creatingEmbed).then((m) => {
          const id = makeid(16)

          const channels = message.guild.channels.cache
            .sort(function (a, b) {
              return a.position - b.position
            })
            .array()
            .map((c) => {
              const channel = {
                type: c.type,
                name: c.name,
                postion: c.calculatedPosition
              }
              if (c.parent) channel.parent = c.parent.name
              return channel
            })

          const roles = message.guild.roles.cache
            .filter((r) => r.name !== '@everyone')
            .sort(function (a, b) {
              return a.position - b.position
            })
            .array()
            .map((r) => {
              const role = {
                name: r.name,
                color: r.color,
                hoist: r.hoist,
                permissions: r.permissions,
                mentionable: r.mentionable,
                position: r.position
              }
              return role
            })

          if (!backups[message.author.id]) backups[message.author.id] = {}
          backups[message.author.id][id] = {
            icon: message.guild.iconURL,
            name: message.guild.name,
            owner: message.guild.ownerID,
            members: message.guild.memberCount,
            createdAt: message.guild.createdAt,
            roles,
            channels
          }

          save()
          const result = new MessageEmbed()
            .setTitle(`${info}  Info`)
            .setDescription(
              `Created backup of **${message.guild.name}** with the Backup id \`${id}\``
            )
            .addField(
              'Usage',
              `\`\`\`backup load ${id}\`\`\`
\`\`\` info ${id}\`\`\``
            )
            .setColor('#5DBCD2')

          message.author.send(result)

          const resultPublic = new MessageEmbed()
            .setTitle(`${green}  Voila!`)
            .setDescription(
              `Created backup of **${message.guild.name}** with the Backup id \`${id}\``
            )
            .addField(
              'Usage',
              `\`\`\` backup load ${id}\`\`\`
\`\`\` backup info ${id}\`\`\``
            )
            .setColor('#59C57B')

          m.edit(resultPublic)
        })
      }

      if (args[0] === 'delete') {
        const code = args[1]
        const errorEmbed = new MessageEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(
            `You forgot to define the argument backup_id. Use  help backup load for more information.
[Support](https://discord.club/discord)`
          )
          .setColor('#a11616')
        if (!code) return message.channel.send(errorEmbed)

        const cantfindbackup = new MessageEmbed()
          .setTitle(`${error}  Error`)
          .setTitle(`You have no backup with the id ${code}.`)
          .setColor('#a11616')
        if (!backups[message.author.id][code]) { return message.channel.send(cantfindbackup) }

        delete backups[message.author.id][code]
        save()

        const deletedsuc = new MessageEmbed()
          .setTitle(`${green}  Voila!`)
          .setDescription('Successfully **deleted backup**.')
          .setColor('#59C57B')
        message.channel.send(deletedsuc)
      }

      if (args[0] === 'load' || args[0] === 'l') {
        const error = client.emojis.cache.get('655704809483141141') || '❌'
        const code = args[1]
        const errorEmbed = new MessageEmbed().setTitle(`${error}  Error`)
          .setDescription(`You forgot to define the argument backup_id. Use help backup load for more information.
[Support](https://discord.gg/NDgrJc2)`)
        if (!code) return message.channel.send(errorEmbed)
        const cantfindbackup = new MessageEmbed()
          .setTitle(`${error}  Error`)
          .setTitle(`You have no backup with the id ${code}.`)
          .setDescription('[Support](https://discord.club/discord)')
          .setColor('#a11616')
        if (!backups[message.author.id][code]) { return message.channel.send(cantfindbackup) }

        message.guild.channels.cache.forEach((channel) => {
          channel.delete('For Loading A Backup')
        })

        message.guild.roles.cache
          .filter((role) => role.members.every((member) => !member.user.bot))
          .forEach((role) => {
            role.delete('For Loading A Backup')
          })
        await backups[message.author.id][code].roles.forEach(async function (
          role
        ) {
          message.guild.roles
            .create({
              name: role.name,
              color: role.color,
              permissions: role.permissions,
              hoist: role.hoist,
              mentionable: role.mentionable,
              position: role.position
            })
            .then((role) => {
              role.setPosition(role.position)
            })
        })

        await backups[message.author.id][code].channels
          .filter((c) => c.type === 'category')
          .forEach(async function (ch) {
            message.guild.channels.create(ch.name, {
              type: ch.type,
              permissionOverwrites: ch.permissionOverwrites
            })
          })

        await backups[message.author.id][code].channels
          .filter((c) => c.type !== 'category')
          .forEach(async function (ch) {
            message.guild.channels
              .create(ch.name, {
                type: ch.type,
                permissionOverwrites: ch.permissionOverwrites
              })
              .then((c) => {
                const parent = message.guild.channels.cache
                  .filter((c) => c.type === 'category')
                  .find((c) => c.name === ch.parent)
                ch.parent ? c.setParent(parent) : ''
              })
          })
        message.guild.setName(backups[message.author.id][code].name)
        message.guild.setIcon(backups[message.author.id][code].icon)
      }

      if (args[0] === 'info' || args[0] === 'i') {
        const id = args[1]
        const MissingbackupinfoEmbed = new MessageEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(
            `You forgot to define the argument **backup_id**. Use \`help backup info\` for more information   
               [Support](https://discord.club/discord)`
          )
          .setColor('#a11616')
        if (!id) return message.channel.send(MissingbackupinfoEmbed)

        const cantfindEmbed = new MessageEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(
            `You have **no backup** with the id \`${id}\`.
           "[Support](https://discord.club/discord)`
          )
          .setColor('#a11616')
        if (!backups[message.author.id][id]) { return message.channel.send(cantfindEmbed) }

        try {
          const infoEmbed = new MessageEmbed()
            .setTitle(backups[message.author.id][id].name)
            .setThumbnail(backups[message.author.id][id].icon)
            .addField(
              'Creator',
              `<@${backups[message.author.id][id].owner}>`,
              true
            )
            .addField('Members', backups[message.author.id][id].members, true)
            .addField('Created At', backups[message.author.id][id].createdAt)
            .addField(
              'Channels',
              `\`\`\`${backups[message.author.id][id].channels
                .map((channel) => channel.name)
                .join('\n')}\`\`\``,
              true
            )
            .addField(
              'Roles',
              `\`\`\`${backups[message.author.id][id].roles
                .map((role) => role.name)
                .join('\n')}\`\`\``,
              true
            )
          message.channel.send(infoEmbed)
        } catch (e) {
          hastebins(
            backups[message.author.id][id].channels
              .map((channel) => channel.name)
              .join('\n'),
            'txt'
          ).then((ch) => {
            hastebins(
              backups[message.author.id][id].roles
                .map((role) => role.name)
                .join('\n'),
              'txt'
            ).then((ro) => {
              const infoEmbed = new MessageEmbed()
                .setTitle(backups[message.author.id][id].name)
                .setThumbnail(backups[message.author.id][id].icon)
                .addField(
                  'Creator',
                  `<@${backups[message.author.id][id].owner}>`,
                  true
                )
                .addField(
                  'Members',
                  backups[message.author.id][id].members,
                  true
                )
                .addField(
                  'Created At',
                  backups[message.author.id][id].createdAt
                )
                .addField('Channels', ch, true)
                .addField('Roles', ro, true)
              message.channel.send(infoEmbed)
            })
          })
        }
      }

      if (args[0] === 'purge') {
        const errorEmbed = new MessageEmbed()
          .setTitle(`${error}  Error`)
          .setDescription(
            `You did'nt backup any server yet
[Support](https://discord.club/discord)`
          )
          .setColor('#a11616')
        if (!backups[message.author.id]) { return message.channel.send(errorEmbed) }

        const warningEmbed = new MessageEmbed().setTitle(`${warning}  Warning`)
          .setDescription(`Are you sure that you want to delete all your backups?
__This cannot be undone!__`)
        message.channel.sendEmbed(warningEmbed).then((msg) => {
          msg.react('✅').then(() => msg.react('❌'))

          const yesFilter = (reaction, user) =>
            reaction.emoji.name === '✅' && user.id === message.author.id
          const noFilter = (reaction, user) =>
            reaction.emoji.name === '❌' && user.id === message.author.id

          const yes = msg.createReactionCollector(yesFilter, { time: 0 })
          const no = msg.createReactionCollector(noFilter, { time: 0 })

          yes.on('collect', (r) => {
            delete backups[message.author.id]

            const deletedsuc = new MessageEmbed()
              .setTitle(`${green}  Voila!`)
              .setDescription('Deleted all your backups.')
              .setColor('#59C57B')
            message.channel.send(deletedsuc)
            msg.delete()
          })

          no.on('collect', (r) => {
            msg.delete()
          })
        })
      }

      if (!args[0]) {
        const embed = new MessageEmbed()
          .setTitle(
            `** backup**
Create & load backups of your servers
__**Commands**__
`
          )
          .setDescription(
            `
            backup create        Create a backup
            backup delete        Delete one of your backups
            backup info          Get information about a backup
            backup list          Get a list of your backups
            backup load          Load a backup
            backup purge         Delete all your backups`
          )
          .addField('\u200b', '\u200b')
          .setFooter(
            `Use \` help [command]\` for more info on a command.
You can also use \` help [category]\` for more info on a category.`
          )
          .setColor('#5DBCD2')
        message.channel.send(embed)
        return
      }

      function makeid (length) {
        var result = ''
        var characters =
          'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        var charactersLength = characters.length
        for (var i = 0; i < length; i++) {
          result += characters.charAt(
            Math.floor(Math.random() * charactersLength)
          )
        }
        return result
      }

      function save () {
        fs.writeFile('./Data/backups.json', JSON.stringify(backups), (err) => {
          if (err) console.error(err)
        })
      }
    } catch (e) {
      console.log(e)
      sendError(message, e)
    }
  }
}
