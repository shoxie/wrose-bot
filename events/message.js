const config = require('../config/config.json');
var {
    db,
    database
} = require('../model/db.js');
module.exports = message => {
    if (message.author.bot) return;
    if (message.content.startsWith(config.prefix)) {
        require('../handler/commandHandler.js')(message)
    }
    let guildID = message.guild.id;
    let dbExist = db.get(`${guildID}`).value();
    if (!dbExist) {
        database.getDB(guildID);
    }
}