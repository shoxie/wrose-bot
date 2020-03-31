const Discord = require("discord.js");
const client = new Discord.Client({ disableEveryone: true });
const config = require("./config/config.json");
const mongoose = require("mongoose");
const logs = require("discord-logs");
logs(client);
process.env.NODE_PATH = __dirname;
require("dotenv").config();
const eventHandler = require("./handler/eventHandler.js")(client);
const commandHandler = require("./handler/commandHandler.js")(client);
client.login(process.env.token);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log("CONNECTED DIT CON ME MAY");
  });
