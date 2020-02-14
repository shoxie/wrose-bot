module.exports = {
    config: {
        name: 'playlist',
        enabled: true,
        usage: 'playlist --arguement [playlist name] [url]'
    },
    run: async (message, args) => {
        message.channel.send('pong')
    }
}