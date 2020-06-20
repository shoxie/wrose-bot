const { addPlaylist } = require("../../model/playlist.model");
let { getSongInfo } = require("../../utils/utility");
module.exports = {
  config: {
    name: "saveQueue",
    usage: "saveQueue [--arguements]",
    aliases: [],
    description:
      "Create playlist from running queue. To modify the playlist use playlist command",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    const serverQueue = await client.queue.get(message.guild.id);
    if (!serverQueue) return message.reply("There is no running queue.");
    for (let i = 0; i < serverQueue.queue.length; i++) {
      await add(serverQueue.queue[i].url, message.author.id);
    }
    async function add(url) {
      try {
        let a = await addPlaylist(url, message.author.id);
        let songInfo = await getSongInfo(url);
        message.channel.send({
          embed: {
            color: 3447003,
            title: "Added one song to your playlist",
            fields: [
              {
                name: "Song name",
                value: songInfo.title,
              },
              {
                name: "Song URL",
                value: songInfo.video_url,
              },
              {
                name: "Playlist author",
                value: message.author.tag,
              },
            ],
          },
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
};
