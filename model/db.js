let message;
let isInit = false;
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('./data/db.json')
const db = low(adapter)
let database = {
    guildID: null,
    updateDB(where, what, value) {

    }
}

module.exports = {
    db,
    database
};