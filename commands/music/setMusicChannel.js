var {
    db,
    database
} = require('../../model/db.js');
module.exports = {
    name: 'setMusicChannel',
    async run(message, args) {
        console.log('running')
        if (is_NaN(args[0])) return message.channel.send('nhap id textChannel');
        else {
            let textChannel = message.channel;
            let voiceChannel = args[0];
            db.updateDB(textChannel, voiceChannel);
        }
    }
}