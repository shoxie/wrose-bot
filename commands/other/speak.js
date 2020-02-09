let { talkify } = require("talkify");
var player = new talkify.TtsPlayer();
module.exports = {
  name: "speak",
  async run(message, args) {
    message.channel.send("Under construction");
    let voiceChannel = await message.member.voiceChannel.join();
    const dispatcher = voiceChannel
      .playStream(player.playText("Hello world"))
      .on("start", () => {
        console.log("playing");
      });
  }
};
