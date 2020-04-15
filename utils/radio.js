let { sendSongQueue, sendPlaying, emptyQueue } = require("./message");
let {updatePresence} = require('./utility')
const play = (client, message) => {
    const serverQueue = client.queue.get(message.guild.id);
    if (!serverQueue.queue[0]) {
      serverQueue.isPlaying = false;
      updatePresence(serverQueue);
      serverQueue.voiceChannel.leave();
      emptyQueue(message, client);
      client.queue.delete(guild);
    } else {
      sendPlaying(message, client);
      serverQueue.dispatcher = serverQueue.connection
        .play(
          ytcore(serverQueue.queue[0].url, {
            filter: "audioonly",
            quality: "highestaudio",
            highWaterMark: 1 << 25,
            encoderArgs: [
              "-af",
              `equalizer=f=40:width_type=h:width=50:g=50`,
            ],
          })
        )
        // serverQueue.dispatcher = serverQueue.connection
        //   .play(await ytDiscord(serverQueue.queue[0].url), { type: "opus" })
        .on("start", () => {
          serverQueue.isPlaying = true;
          updatePresence(serverQueue);
          addTopSong(serverQueue.queue[0].title);
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
          sendErrorMail(error)
        });
    }
}