const { MessageEmbed } = require("discord.js");
module.exports = {
  config: {
    name: "firstMessage",
    usage: "firstMessage",
    aliases: [],
    description: "Show the first ever message sent to the channel",
    ownerOnly: false,
    enabled: true
  },
  async run(client, msg, args) {
    if (
      msg.channel.type === "text" &&
      !msg.channel.permissionsFor(client.user).has("READ_MESSAGE_HISTORY")
    ) {
      return msg.reply(
        `Sorry, I don't have permission to read ${msg.channel}...`
      );
    }
    const messages = await msg.channel.messages.fetch({ after: 1, limit: 1 });
    const message = messages.first();
    const embed = new MessageEmbed()
      .setColor(message.member ? message.member.displayHexColor : 0x00ae86)
      .setThumbnail(
        message.author.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ format: "png", dynamic: true })
      )
      .setDescription(message.content)
      .setTimestamp(message.createdAt)
      .setFooter(`ID: ${message.id}`)
      .addField("❯ Jump", message.url);
    return msg.channel.send(embed);
  }
};
