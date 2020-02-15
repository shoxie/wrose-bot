const config = require('../config/config.json');
var {
    db,
    database
} = require('../model/db.js');
module.exports = (client) => {
    return function (message) {
    const args = message.content
        .slice(config.prefix.length)
        .trim()
        .split(/ +/g);
    const cmd = args.shift();
    console.log(cmd)
    if (cmd.length === 0) return;
    client.commands.get(cmd).run(client, message, args)
    let guildID = message.guild.id;
    let dbExist = db.get(`${guildID}`).value();
    if (message.author.bot) return;
    if (!dbExist) {
        database.getDB(guildID);
    }
    }
}