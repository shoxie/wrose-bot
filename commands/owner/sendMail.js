const send = require("gmail-send")({
  user: "minzycrackteam@gmail.com",
  pass: "kjbarjuidzcevgcn",
  to: "sktt1lka@gmail.com",
  subject: "Error on DiscordBot",
  text: "Error happened",
});
module.exports = {
  config: {
    name: "idk",
    usage: "idk",
    description: "",
    aliases: [],
    enabled: true,
    ownerOnly: true,
  },
  async run(client, message, args) {
   
  },
};
