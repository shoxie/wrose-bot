const Discord = require("discord.js");
const client = new Discord.Client();
require("dotenv").config;
const fs = require("fs");
const prism = require("prism-media");
const ytdl = require("discord-ytdl-core");

client.login("");
client.on("ready", () => {
  console.log("loaded");
});

client.on("message", async message => {
  if (message.content === "test") {
    let voiceconnection = await message.member.voiceChannel.join();
    let input = ytdl("https://www.youtube.com/watch?v=3DIT8Y3LC6M", {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25,
      passArgs: ["-af", "equalizer=f=1000:width_type=h:width=20 0:g=0"] // custom ffmpeg args
    });

    voiceconnection.playOpusStream(input, {
      filter: "audioonly",
      quality: "highestaudio",
      highWaterMark: 1 << 25
    });
  }
});
