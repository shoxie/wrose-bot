let helpModel = {
    title: null,
    usage: null,
    sendHelp(channel) {
        channel.send({
            embed: {
                title: helpModel,
                usage: this.usage
            }
        })
    }
}