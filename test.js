const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config;
const fs = require("fs");
const prism = require("prism-media");
const ytdl = require("discord-ytdl-core");

client.login("NDcwMjQyMzY4NzE3NTg2NDQ0.XlvnIw.-u3vBH18RLgZjNVc_P_fQokM6CU");
client.on("ready", () => {
  console.log("loaded");
});

client.on("message", async message => {
  if (message.content === "test") {
    let voiceconnection = await message.member.voice.channel.join();
    let input = ytdl("https://www.youtube.com/watch?v=3DIT8Y3LC6M", {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
      passArgs: ["-af", "equalizer=f=1000:width_type=h:width=20 0:g=0"] // custom ffmpeg args
    });

    let dispatcher = voiceconnection.playOpusStream(input, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25
    });
  }
  if (message.content === "seek") {
    dispatcher.seek(100);
  }
});
