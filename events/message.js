module.exports = message => {
    if (message.content === 'ping') message.channel.send('pong');
}