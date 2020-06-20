const malScraper = require("mal-scraper");
const { MessageEmbed } = require("discord.js");

module.exports = {
  config: {
    name: "animeSearch",
    usage: "animeSearch [anime name]",
    aliases: [],
    description: "Search for anime film statistic",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    const search = args.join(" ");
    if (!search) return message.reply("error");

    malScraper
      .getInfoFromName(search)
      .then((anime) => {
        //console.log(anime);
        const embed = new MessageEmbed()
          .setThumbnail(anime.picture)
          .setColor("BLUE")
          .setTitle(anime.title)
          .setDescription(anime.synopsis)
          .addField(
            "Translated title",
            anime.englishTitle ? anime.englishTitle : anime.japaneseTitle,
            true
          )
          .addField("Anime type", anime.type, true)
          .addField("Numbers of episodes", anime.episodes, true)
          .addField("Rating", anime.rating, true)
          .addField("Release date", anime.aired, true)
          .addField("Anime score", anime.score, true)
          .addField("Anime score stats", anime.scoreStats, true)
          .addField("Anime duration", anime.duration, true)
          .addField("Anime rank", anime.ranked, true)
          .addField("Anime popularity", anime.popularity, true)
          .addField(`${anime.genres.join(", ")}`, true);

        message.channel.send(embed);
      })
      .catch((err) => {
        console.log(err.stack);
        message.reply(err.message);
      });
  },
};
