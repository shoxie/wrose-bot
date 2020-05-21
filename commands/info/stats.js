
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const moment = require("moment");
const osu = require("node-os-utils");
const os = require("os");
require("moment-duration-format");
let Colors = {
    "DEFAULT": "0",
    "AQUA": "1abc9c",
    "GREEN": "2ecc71",
    "BLUE": "3498db",
    "PURPLE": "9b59b6",
    "GOLD": "f1c40f",
    "ORANGE": "e67e22",
    "RED": "e74c3c",
    "GREY": "95a5a6",
    "DARKER_GREY": "7f8c8d",
    "NAVY": "34495e",
    "DARK_AQUA": "11806a",
    "DARK_GREEN": "1f8b4c",
    "DARK_BLUE": "206694",
    "DARK_PURPLE": "71368a",
    "DARK_GOLD": "c27c0e",
    "DARK_ORANGE": "a84300",
    "DARK_RED": "992d22",
    "DARK_GREY": "979c9f",
    "LIGHT_GREY": "bcc0c0",
    "DARK_NAVY": "2c3e50",
    "LUMINOUS_VIVID_PINK": "fd0061",
    "DARK_VIVID_PINK": "bc0057",
    "CUSTOM": "2b2c36",
    "G_TRANSLATE": "4989f4",
    "GITHUB": "282828",
    "IMDB": "f3ce13",
    "INSTAGRAM": "e1306c",
    "MAL": "2e51a2",
    "NPM": "cc3534",
    "STEAM": "2a475e",
    "YOUTUBE": "c4302b",
    "WIKIPEDIA": "6b6b6b"
}
module.exports = {
  config: {
    name: "stats",
    usage: "stats",
    aliases: [],
    description: "Show bot statistics",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let freeRAM = os.freemem();
    let usedRAM = os.totalmem() - freeRAM;
    let full = "▰";
        let empty = "▱";
        let diagramMaker = (used,free) => {
            let total = used + free;
            used = Math.round((used / total) * 10);
            free = Math.round((free / total) * 10);
            return full.repeat(used) + empty.repeat(free);
        };

        let cpuUsage;
        
        const p1 = osu.cpu.usage().then((cpuPercentage) => {
            cpuUsage = cpuPercentage;
        });

        await Promise.all([p1]);

        const roleColor = message.guild.me.roles.highest.hexColor;
    
        const statsEmbed = new MessageEmbed()
            .setColor(roleColor === "#000000" ? Colors.CUSTOM : roleColor)
            .setAuthor(`${client.user.username}'s statistics information`, client.user.avatarURL({ dynamic: true }))
            .setDescription("Here are some stats about the bot and other stuff")
            .setThumbnail(client.user.displayAvatarURL({ format: "png", dynamic: true, size: 4096 }))
            .addField("__**Performance**__", stripIndents`
                RAM: ${diagramMaker(usedRAM, freeRAM)} [${Math.round(100 * usedRAM / (usedRAM + freeRAM))}%]
                CPU: ${diagramMaker(cpuUsage, 100-cpuUsage)} [${Math.round(cpuUsage)}%]`, false)
            .addField("__**System**__", stripIndents`
                Processor: ${os.cpus()[0].model} (${osu.cpu.count()} Cores)
                Total RAM: ${(usedRAM / 1024 / 1024 / 1024).toFixed(2)} GB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`, false)
            .addField("__**Operation System**__", `${os.type} ${os.release} ${os.arch}`, false)
            .addField("__**Total Users**__", client.users.cache.size, true)
            .addField("__**Total Emotes**__", client.emojis.cache.size, true)
            .addField("__**Total Guilds**__", client.guilds.cache.size, true)
            .addField("__**Bot Uptime**__", moment.duration(client.uptime).format("D [days], H [hrs], m [mins], s [secs]"), true)
            .addField("__**Host Uptime**__", moment.duration(os.uptime*1000).format("D [days], H [hrs], m [mins], s [secs]"), true)
            .setFooter(`Created by wrose | Last started on ${moment(client.readyAt).format("ddd, DD MMMM YYYY HH:mm [GMT]Z")}`);

        message.channel.send(statsEmbed);
  }
};
