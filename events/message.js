const config = require('../config/config.json');
module.exports = message => {
    if (message.author.bot) return;
    if (message.content.startsWith(config.prefix)) {
        require('../handler/commandHandler.js')(message)
    }
}