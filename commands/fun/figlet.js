let figlet = require("figlet");
module.exports = {
  config: {
    name: "figlet",
    usage: "figlet [text]",
    description: "ASCII a text",
    enabled: true
  },
  async run(client, message, args) {
    if (!args[0]) {
      message.channel.send({
        embed: {
          color: 15158332,
          title: "__***YOU THINK I'M A FOOL?***__",
          description: "Input a text"
        }
      });
    } else {
      figlet(args.join(" "), function(err, data) {
        if (err) {
          console.log("Something went wrong...");
          console.dir(err);
          return;
        }
        message.channel.send("```" + data + "```");
      });
    }
  }
};
