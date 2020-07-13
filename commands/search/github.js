const axios = require('axios')
const moment = require('moment')
const { MessageEmbed } = require('discord.js')
const { Colors } = require('../../utils/canvas')
const { redMessage } = require('../../utils/message')

module.exports = {
  config: {
    name: 'github',
    usage: 'github',
    aliases: ['git'],
    description: 'Show Github user or repo information',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    if (!args[0]) {
      return redMessage(message, 'Wrong usage')
    }

    if (args[0] && args[1]) {
      if (!args[0]) {
        return redMessage(
          message,
          "Please provide the repository owner's username or organisation name."
        )
      }

      if (!args[1]) {
        return redMessage(
          message,
          'Please provide a repository name to search for.'
        )
      }

      axios
        .get(`https://api.github.com/repos/${args[0]}/${args[1]}`)
        .then((res) => {
          const repos = res.data

          if (repos.message) {
            return redMessage(
              message,
              '404',
              `I wasnt able to find \`${args[0]}/${args[1]}\` on the github website!`
            )
          }

          const reposEmbed = new MessageEmbed()
            .setColor(Colors.GITHUB)
            .setAuthor(
              'GitHub Search Engine',
              'https://i.imgur.com/e4HunUm.png',
              'https://github.com/'
            )
            .setTitle(repos.full_name)
            .setURL(repos.html_url)
            .setThumbnail(repos.owner.avatar_url)
            .setDescription(
              repos.description ? repos.description : '[No description set]'
            )
            .addField(
              'Updated',
              moment(repos.updated_at, 'YYYYMMDDHHmmss').fromNow(),
              true
            )
            .addField(
              'Pushed',
              moment(repos.pushed_at, 'YYYYMMDDHHmmss').fromNow(),
              true
            )
            .addField(
              'Created',
              `${moment(repos.created_at).format(
                'ddd, DD MMMM YYYY HH:mm [GMT]Z'
              )} (${moment(repos.created_at, 'YYYYMMDDHHmmss').fromNow()})`,
              false
            )
            .addField('Stars', repos.stargazers_count, true)
            .addField('Forks', repos.forks, true)
            .addField('Issues', repos.open_issues, true)
            .addField('Language', repos.language || 'No language', true)
            .addField(
              'License',
              repos.license ? repos.license.spdx_id : 'Unlicensed',
              true
            )
            .addField(
              'Archived',
              repos.archived.toString() === 'True' ? 'Yes' : 'No',
              true
            )
            .setFooter('Powered by GitHub')
            .setTimestamp()

          message.channel.send(reposEmbed)
        })
    } else if (args[0]) {
      if (!args[0]) {
        return redMessage(
          message,
          'Please provide a valid github account to search.'
        )
      }

      axios.get(`https://api.github.com/users/${args[0]}`).then((res) => {
        const users = res.data

        if (users.message) {
          return redMessage(
            message,
            '404',
            `I wasnt able to find \`${args[0]}\` on the github website!`
          )
        }

        const usersEmbed = new MessageEmbed()
          .setColor(Colors.GITHUB)
          .setAuthor(
            'GitHub Search Engine',
            'https://i.imgur.com/4EDz1aY.png',
            'https://github.com/'
          )
          .setTitle(users.login)
          .setURL(users.html_url)
          .setThumbnail(users.avatar_url)
          .setDescription(`${users.bio || '[No bio set]'}`)
          .addField('Name', `${users.name || 'Not Public.'}`, true)
          .addField('ID', `${users.id || 'Unknown'}`, true)
          .addField(
            'Updated',
            `${moment(users.updated_at, 'YYYYMMDDHHmmss').fromNow()}`,
            true
          )
          .addField('Location', `${users.location || 'Invisible.'}`, false)
          .addField('Repositories', `${users.public_repos}`, true)
          .addField('Followers', `${users.followers}`, true)
          .addField('Following', `${users.following}`, true)
          .addField(
            'Created',
            `${moment(users.created_at).format(
              'ddd, DD MMMM YYYY HH:mm [GMT]Z'
            )} (${moment(users.created_at, 'YYYYMMDDHHmmss').fromNow()})`,
            false
          )
          .setFooter('Powered by GitHub')
          .setTimestamp()

        message.channel.send(usersEmbed)
      })
    }
  }
}
