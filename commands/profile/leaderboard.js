const Pagination = require("discord-paginationembed");
module.exports = {
  config: {
    name: "leaderboard",
    usage: "leaderboard",
    aliases: [],
    description: "Show current server chat xp leaderboard",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    const rawLeaderboard = await client.levels.fetchLeaderboard(
      message.guild.id,
      50
    ); // We grab top 10 users with most xp in the current server.
    let embeds = [];
    if (rawLeaderboard.length < 1) return reply("Nobody's in leaderboard yet.");

    const leaderboard = client.levels.computeLeaderboard(
      client,
      rawLeaderboard
    ); // We process the leaderboard.

    const lb = leaderboard.map((e) => {
      `${e.position}. ${e.username}#${e.discriminator}\nLevel: ${
        e.level
      }\nXP: ${e.xp.toLocaleString()}`;
      let data = {
        position: e.position,
        username: e.username,
        level: e.level,
        xp: e.xp.toLocaleString(),
      };
      embeds.push(data);
    }); // We map the outputs.
    const msg = new Pagination.FieldsEmbed()
      .setArray(embeds)
      .setAuthorizedUsers([])
      .setChannel(message.channel)
      .setPageIndicator(true)
      .formatField("Position", (i) => i.position)
      .formatField("Username", (i) => i.username)
      // .formatField("Level", (i) => i.level)
      .formatField("Xp", (i) => i.xp)
      .setElementsPerPage(10)
      .setDeleteOnTimeout(true)
      .setEmojisFunctionAfterNavigation(true);
    msg.embed
      .setThumbnail(
        client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
      )
      .setColor("#0390fc")
      .setFooter("Created by wrose");
    await msg.build();
  },
};
