module.exports = {
  config: {
    name: "restart",
    usage: "restart",
    aliases: ["rt"],
    description: "Restart the bot",
    ownerOnly: true,
    enabled: true,
  },
  async run(client, message, args) {
    console.log("1");
    message.channel.send("RESTARTING").then(async (m) => {
      // await client.destroy();
      // await client.login(process.env.token);
      process.exit(2);
    });
  },
};
