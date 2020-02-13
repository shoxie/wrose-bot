let fs = require("fs");
let noob = require("../music/playlist");
module.exports = {
    name: "help",
    help: {
        usage: "help [command name]"
    },
    async run(message, args) {
        let help = args[0];
        console.log(help)
        fs.readdir("/").forEach(dir => {
            console.log(dir)
            const commands = fs.readdir(`/${dir}/`).filter(file => {
                var filename = file.split('.').slice(0, -1).join('.')
                // console.log(filename.toLowerCase())
                if (help === filename.toLowerCase()) {
                    let helpExported = require("/" + dir + '/' + help + '.js');
                    // message.channel.send(helpExported.usage);
                    console.log(helpExported.help.usage)
                }
            });
        });
        // message.channel.send(noob.help.usage);
    }
};