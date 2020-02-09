const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)
module.exports = {
    name: 'setMusicChannel',
    async run(message, args) {
        if (!message.member.voiceChannel) {
            message.channel.send({
                embed: {
                    color: 15158332,
                    title: 'You have to be in a voiceChannel to setup the musicChannel'
                }
            })
            return;
        }
        console.log(message.flags)
        // if (message.flags[0] === 'show') {
        //     let musicTextChannel = db.get('guild').find({
        //         id: message.member.guild.id
        //     }).get('musicTextChannel', 'musicVoiceChannel').value()
        //     let musicVoiceChannel = db.get('guild').find({
        //         id: message.member.guild.id
        //     }).get('musicVoiceChannel').value()
        //     message.channel.send({
        //         embed: {
        //             color: 3066993,
        //             title: 'Current server settings',
        //             fields: [{
        //                     name: 'musicVoiceChannel',
        //                     value: musicVoiceChannel
        //                 },
        //                 {
        //                     name: 'musicTextChannel',
        //                     value: musicTextChannel
        //                 }
        //             ]
        //         }
        //     })
        // }
        let guildName = message.member.guild.name;
        db.defaults({
            guild: [],
        }).write();
        let guildID = await db.get('guild').find({
            id: message.member.guild.id
        }).value();
        if (!guildID) {
            db.get('guild').push({
                id: message.member.guild.id,
                musicVoiceChannel: null,
                musicTextChannel: null
            }).write()
        }
        if ((args[0] != undefined) && (message.member.guild.channels.find('id', args[0]))) {
            console.log('here')
            db.get('guild').find({
                    id: message.member.guild.id
                }).update("musicVoiceChannel", n => n = message.member.voiceChannelID).update("musicTextChannel", n => n = args[0])
                .write();
        } else {
            message.channel.send({
                embed: {
                    color: 15158332,
                    title: 'Cannot find the specific channel'
                }
            })
        }




    }
}