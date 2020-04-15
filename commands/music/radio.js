const stations = require("../../data/stations.json");
const { play } = require("../../utils/radio");
module.exports = {
  config: {
    name: "radio",
    usage: "radio",
    aliases: [],
    description: "Start listening to a radio station",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    const serverQueue = client.queue.get(message.guild.id);
    if (serverQueue) return message.reply("Occupied somewhere else.");
    try {
      if (args[0] === "--play") {
        let tempQueue = await initQueue(message);
        tempQueue.radio = true;
        const station = stations[args[1]];
        if (!station) {
          return funcs.send("No such station found");
        }
      } else if (args[0] === "--stations") {
      } else if (args[0] === "--stop") {
      }
    } catch (error) {}
  },
};
