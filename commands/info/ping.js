module.exports = {
    catetory: 'info',
    run: async (message, args) => {
        console.log(args[0])
        message.channel.send('pong')
    }
}