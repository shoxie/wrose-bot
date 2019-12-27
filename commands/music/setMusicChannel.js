var db = require('../../model/db.js');
module.exports = {
    name: 'setMusicChannel',
    async run(message, args) {
        if (is_NaN(args[0])) return message.channel.send('nhap id textChannel');
        else {
            db.updateDB(message, args[0]);
        }
    }
}