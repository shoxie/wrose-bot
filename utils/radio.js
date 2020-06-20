let { sendSongQueue, sendPlaying, emptyQueue } = require("./message");
let { updatePresence, sendErrorMail } = require("./utility");
const Pagination = require("discord-paginationembed");
const ytcore = require("ytdl-core");
const stations = require("../data/stations.json");
const play = (client, message, station) => {
  const serverQueue = client.queue.get(message.guild.id);
  console.log(serverQueue);
  if (!serverQueue.queue[0]) {
    serverQueue.isPlaying = false;
    updatePresence(message, serverQueue);
    serverQueue.voiceChannel.leave();
    emptyQueue(message, client);
    client.queue.delete(guild);
  } else {
    sendPlaying(message, client);
    serverQueue.dispatcher = serverQueue.connection
      .play(serverQueue.queue[0].url, {
        filter: "audioonly",
        quality: "highestaudio",
        highWaterMark: 1 << 25,
        encoderArgs: ["-af", `equalizer=f=40:width_type=h:width=50:g=50`],
      })
      // serverQueue.dispatcher = serverQueue.connection
      //   .play(await ytDiscord(serverQueue.queue[0].url), { type: "opus" })
      .on("start", () => {
        serverQueue.isPlaying = true;
        updatePresence(message, serverQueue);
      })
      .on("finish", () => {
        console.log("stop playing");
        serverQueue.queue.shift();
        play(message.guild.id);
      })
      .on("volumeChange", (oldVolume, newVolume) => {
        message.channel.send({
          embed: {
            title: `Volume changed from ${oldVolume} to ${newVolume}.`,
            author: {
              name: message.client.user.username,
              icon_url: message.client.user.avatarURL({
                format: "png",
                dynamic: true,
                size: 1024,
              }),
            },
          },
        });
      })
      .on("end", () => {
        serverQueue.queue.shift();
      })
      .on("error", (error) => {
        console.log(error);
        sendErrorMail(error);
      });
  }
};
const stop = (client, message) => {
  const serverQueue = client.queue.get(message.guild.id);
  if (!serverQueue) return message.reply("Not playing radio stream");
  if (!serverQueue.radio) message.reply("Use skip command please");
  try {
    serverQueue.dispatcher.destroy();
    serverQueue.voiceChannel.leave();
    client.queue.delete(message.guild.id);
  } catch (error) {
    console.log(error);
  }
};
const showStations = async (client, message) => {
  let embeds = [];
  for (let station of Object.keys(stations)) {
    let data = {
      name: station,
    };
    embeds.push(data);
  }
  const infor = new Pagination.FieldsEmbed()
    .setArray(embeds)
    .setAuthorizedUsers([])
    .setChannel(message.channel)
    .setPageIndicator(true)
    .formatField("Name", (i) => i.name + "\n")
    .setDeleteOnTimeout(true)
    .setElementsPerPage(10)
    .setEmojisFunctionAfterNavigation(true);
  infor.embed
    .setThumbnail(
      client.user.avatarURL({ format: "png", dynamic: true, size: 1024 })
    )
    .setColor("#0390fc")
    .setFooter("Created by wrose");
  await infor.build();
};
module.exports = {
  play,
  stop,
  showStations,
};
