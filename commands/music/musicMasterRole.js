const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/guildSettings.json");
const db = low(adapter);
module.exports = {
    config: {
        name: null,
        usage: null,
        enabled: null,
    },
    async run(client, message, args) {
        let guild = db.get('guild').find({
            id: message.member.guild.id
        }).value();
        if (!guild) {
            db.get('guild').push({
                id: message.member.guild.id
            }).write()
        }
        if ((guild) && (message.member.guild.roles.find(x => x.id === args[0]))) {
            db.get('guild').find({
                id: message.member.guild.id
            }).push({
                musicMasterRole: args[0]
            }).write();
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: message.member.guild.roles.find(x => x.id === args[0]).name + ' has been choosen as musicMasterRole',
                }
            })
        } else {
            message.channel.send({
                embed: {
                    color: 15158332,
                    title: "Cannot find the specific role"
                }
            });
        }


        if (args[0] === '--help') {
            return sendHelp(this.config);
        }

        function sendHelp(config) {
            message.channel.send({
                embed: {
                    color: 3447003,
                    title: `Description of ` + config.name,
                    description: config.usage,
                    thumbnail: {
                        url: message.client.user.avatarURL
                    },
                    footer: {
                        text: 'Created by wrose'
                    }
                }
            })
        }
    }
}