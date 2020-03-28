const moment = require("moment");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { trimArray } = require("../../utils/utility");
module.exports = {
  config: {
    name: "userInfo",
    usage: "userInfo",
    aliases: [],
    description: "Send message author information",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    let user;
    if (!message.mentions.users.first()) user = message.author;
    else user = message.mentions.users.first();
    const embed = new MessageEmbed()
      .setAuthor(user.tag)
      .setThumbnail(user.displayAvatarURL({ format: "png", dynamic: true }));
    let description = stripIndents`
    **General User Info:**
    • ID: ${user.id}
    • Discord Join Date: ${moment
      .utc(user.createdAt)
      .format("MM/DD/YYYY h:mm A")}
    • ${user.bot ? "Bot" : "Not a Bot"}
`;
    if (message.channel.type === "text") {
      try {
        const member = await message.guild.members.fetch(user.id);
        const defaultRole = message.guild.roles.cache.get(message.guild.id);
        const roles = member.roles.cache
          .filter(role => role.id !== defaultRole.id)
          .sort((a, b) => b.position - a.position)
          .map(role => role.name);
        description += "\n\n";
        description += stripIndents`
            **Server Member Info:**
            • Nickname: ${member.nickname || "None"}
            • Server Join Date: ${moment
              .utc(member.joinedAt)
              .format("MM/DD/YYYY h:mm A")}
            • Highest Role: ${
              member.roles.highest.id === defaultRole.id
                ? "None"
                : member.roles.highest.name
            }
            • Hoist Role: ${
              member.roles.hoist ? member.roles.hoist.name : "None"
            }
            **Roles (${roles.length})**
            • ${roles.length ? trimArray(roles, 6).join(", ") : "None"}
        `;
        embed.setColor(member.displayHexColor);
      } catch {
        embed.setFooter(
          "Failed to resolve member, showing basic user information instead."
        );
      }
    }
    embed.setDescription(description);
    return message.channel.send(embed);
  }
};
