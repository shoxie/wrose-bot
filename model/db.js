let message;
let isInit = false;
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./data/db.json')
const db = low(adapter)
let database = {
    guild: this.guild,
    musicChannel: this.musicChannel,
    musicTextChannel: this.musicTextChannel,
    init() {
        msg = message,
            isInit = true;
    },
    getDB() {
        var guildID = message.guild.id;
        db.defaults({
            guildID: [],
            musicChannel: null,
            musicTextChannel: null
        });
        db.get(guildID)
    }
}
module.exports = database;