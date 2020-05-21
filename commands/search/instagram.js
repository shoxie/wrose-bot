const { Colors } = require("../../utils/canvas");
const { redMessage } = require("../../utils/message");
const request = require("request-promise-native");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { formatNumber } = require("../../utils/utility");
module.exports = {
  config: {
    name: "instagram",
    usage: "instagram",
    aliases: ["ig"],
    description: "Search for an Instagram account",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    let name = args[0];
    request(`https://instagram.com/${name}/?__a=1`, async function (
      error,
      response,
      body
    ) {
      let data = JSON.parse(body);
      let account = data.graphql.user;
      const instagramEmbed = new MessageEmbed()
        .setColor(Colors.INSTAGRAM)
        .setAuthor(
          "Instagram Search Engine",
          "https://i.imgur.com/wgMjJvq.png",
          "https://instagram.com/"
        )
        .setTitle(account.full_name)
        .setURL(`https://instagram.com/${name}`)
        .setThumbnail(account.profile_pic_url_hd)
        .setDescription(
          stripIndents`
                    ${
                      account.biography.length === 0
                        ? "None"
                        : account.biography
                    }
                    ${account.external_url || " "}`
        )
        .addField("Username", `@${account.username}`, true)
        .addField("Verified", account.is_verified ? "Yes" : "No", true)
        .addField("Private", account.is_private ? "Yes 🔐" : "No 🔓", true)
        .addField(
          "Posts",
          formatNumber(account.edge_owner_to_timeline_media.count),
          true
        )
        .addField(
          "Followers",
          formatNumber(account.edge_followed_by.count),
          true
        )
        .addField("Following", formatNumber(account.edge_follow.count), true)
        .setFooter("Powered by Instagram")
        .setTimestamp();

      message.channel.send(instagramEmbed);
    });
  },
};
