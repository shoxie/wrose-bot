const fs = require('fs');
module.exports = {
    run(message, args) {
        message.channel.send(args[0])

    }
}