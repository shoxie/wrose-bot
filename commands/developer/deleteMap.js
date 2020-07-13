module.exports = {
  config: {
    name: 'deleteMap',
    usage: 'deleteMap',
    aliases: [],
    description: 'deleteMap',
    ownerOnly: true,
    enabled: true
  },
  async run (client, message, args) {
    client.games.clear()
  }
}
