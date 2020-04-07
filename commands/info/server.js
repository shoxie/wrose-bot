const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const filterLevels = ["Off", "No Role", "Everyone"];
const verificationLevels = [
  "None",
  "Low",
  "Medium",
  "(╯°□°）╯︵ ┻━┻",
  "┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻"
];
module.exports = {
  config: {
    name: "server",
    usage: "server",
    aliases: [],
    description: "Show description for current Discord server",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    if (!message.guild.members.cache.has(message.guild.ownerID))
      await message.guild.members.fetch(message.guild.ownerID);
    const embed = new MessageEmbed()
      .setColor(0x00ae86)
      .setThumbnail(message.guild.iconURL({ format: "png" }))
      .setAuthor(message.guild.name).setDescription(stripIndents`
            **General Info:**
            • ID: ${message.guild.id}
            • Owner: ${message.guild.owner.user.tag}
            • Region: ${message.guild.region.toUpperCase()}
            • Creation Date: ${moment
              .utc(message.guild.createdAt)
              .format("MM/DD/YYYY h:mm A")}
            • Explicit Filter: ${
              filterLevels[message.guild.explicitContentFilter]
            }
            • Verification Level: ${
              verificationLevels[message.guild.verificationLevel]
            }
            **Server Stats:**
            • Members: ${message.guild.memberCount}
            • Roles: ${message.guild.roles.cache.size}
            • Channels: ${
              message.guild.channels.cache.filter(
                channel => channel.type !== "category"
              ).size
            }
        `);
    return message.channel.send(embed);
  }
};
