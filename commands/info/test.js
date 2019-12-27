const fs = require('fs');
var database = require('../../model/db.js');


module.exports = {
    run(message, args) {
        message.channel.send(args[0])
        database.getDB(message)
    }
}