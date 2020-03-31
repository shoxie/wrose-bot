let rules = require("../config/rules.json");
let roles = [
  "Tiên tri",
  //"Bảo vệ",
  //"Thợ săn",
  //"Phù thủy",
  //"Sói",
  "Sói"
  //"Sói lửa",
  //"Nguyện nữ",
  //"Thầy đồng"
];
const Discord = require("discord.js");
const ascii = require("ascii-table");

async function init(client, message, players) {
  let gameCategory = message.guild.channels.cache.find(
    x => x.name === "warewolf"
  );
  let gameChannel = message.guild.channels.cache.find(
    x => x.name === "game-session"
  );
  let category;
  if (!gameCategory) {
    category = await message.guild.channels.create("warewolf", {
      type: "category"
    });
  } else category = gameCategory;
  if (!gameChannel) {
    gameChannel = await message.guild.channels.create("game-session", {
      type: "text"
    });
    gameChannel.setParent(category.id);
  }
  let model = {
    players: [],
    deadPlayers: [],
    alivePlayers: [],
    gameChannel: null,
    wolves: [],
    roles: roles,
    time: "day"
  };

  for (player of players) {
    player.isSlept = false;
    player.isKilled = false;
    player.isProtected = false;
    model.players.push(player);
  }
  client.warewolf.set(message.guild.id, model);
  gameProcess(client, message);
}
async function gameProcess(client, message) {
  const game = client.warewolf.get(message.guild.id);
  //console.log(serverGame.players);
  for (player of game.players) {
    // fixx here
    player.role = game.roles.pop();
    await game.alivePlayers.push(player);
  }
  sendRole(client, message);
}
async function sendRole(client, message) {
  const game = client.warewolf.get(message.guild.id);
  //console.log(serverGame.alivePlayers);
  for (player of game.alivePlayers) {
    await player.send(player.role);
    if (player.role === "Sói") {
      game.wolves.push(player);
    }
  }
  gettingReady(client, message, game);
}
async function gettingReady(client, message, game) {
  let channel = message.guild.channels.cache.find(
    x => x.name === "game-session"
  );
  channel.send("Are you ready ? ");
  channel.send("```" + getAlivePlayers(game) + "```");
  setTimeout(() => {
    night(client, message, game);
  }, 10000);
}
async function night(client, message, game) {
  moonGirl(client, message, game);
}
async function moonGirl(client, message, game) {
  for (player of game.alivePlayers) {
    if (player.role === "Nguyệt Nữ") {
      await player.send("```" + getAlivePlayers(game) + "```");
      await player.send("Đêm nay bạn muốn đi khách ở đâu?");

      const collector = new Discord.MessageCollector(
        player.dmChannel,
        m => m.author.id === message.author.id,
        { time: 30000 },
        { limit: 1 }
      );
      collector.on("collect", async collected => {
        if (!collected.length) {
          player.send(
            "Bạn đã không chọn người chơi, hệ thống sẽ chọn ngẫu nhiên"
          );
          let alive = game.alivePlayers;
          let random = alive[Math.floor(Math.random() * alive.length)];
          random.isSlept = true;
          return;
        } else {
          if (!parseInt(collected.first().content)) {
            player.send("Sai quy tắc, sẽ chọn ngẫu nhiên");
            let alive = game.alivePlayers;
            let random = alive[Math.floor(Math.random() * alive.length)];
            random.isSlept = true;
            return;
          } else {
            let choice = parseInt(collected.first().content);
            game.alivePlayers[alivePlayers.indexOf(choice)].isSlept = true;
          }
        }
      });
    }
  }
  protector(client, message, game);
}
async function protector(client, message, game) {
  for (player of game.alivePlayers) {
    if (player.role === "Người bảo vệ") {
      await player.send("```" + getAlivePlayers(game) + "```");
      await player.send("Bạn muốn bảo vệ ai ?");
      const collector = new Discord.MessageCollector(
        player.dmChannel,
        m => m.author.id === message.author.id,
        { time: 30000 },
        { limit: 1 }
      );
      collector.on("collect", collected => {
        if (!collected.length) {
          player.send(
            "Bạn đã không chọn người chơi, hệ thống sẽ chọn ngẫu nhiên"
          );
          let alive = game.alivePlayers;
          let random = alive[Math.floor(Math.random() * alive.length)];
          random.isProtected = true;
          return;
        } else {
          if (!parseInt(collected.first().content)) {
            player.send("Sai quy tắc, sẽ chọn ngẫu nhiên");
            let alive = game.alivePlayers;
            let random = alive[Math.floor(Math.random() * alive.length)];
            random.isProtected = true;
            return;
          } else {
            let choice = parseInt(collected.first().content);
            game.alivePlayers[alivePlayers.indexOf(choice)].isProtected = true;
          }
        }
      });
    }
  }
  prophet(client, message, game);
}
async function prophet(client, message, game) {
  for (player of game.alivePlayers) {
    if (player.role === "Tiên tri") {
      await player.send("Đêm nay bạn muốn soi ai?");
      await player
        .send("```" + getAlivePlayers(game) + "```")
        .catch(function(err) {
          str = "Unable to send you the list because you cannot receive DMs.";
          if (err != "DiscordAPIError: Cannot send messages to this user")
            console.log(err);
        });
      const collector = new Discord.MessageCollector(
        player.dmChannel,
        m => m.channel.id === player.dmChannel.id && !player.bot,
        { time: 30000, max: 1 }
      ).on("end", async collected => {
        console.log(collected.content);
        if (!parseInt(collected.content))
          return player.send("Sai quy tắc, mất lượt");
        else {
          let choice = parseInt(collected.content);
          if (game.alivePlayers[alivePlayers.indexOf(choice)].role === "Sói")
            await player.send("tiên tri đúng");
          else await player.send("Tiên tri sai");
        }
      });
      // collector.on("collect", async collected => {
      //   console.log(collected.content);
      //   if (!parseInt(collected.content))
      //     return player.send("Sai quy tắc, mất lượt");
      //   else {
      //     let choice = parseInt(collected.content);
      //     if (game.alivePlayers[alivePlayers.indexOf(choice)].role === "Sói")
      //       await player.send("tiên tri đúng");
      //     else await player.send("Tiên tri sai");
      //   }
      // });
    }
  }
}
function getAlivePlayers(game) {
  let table = new ascii("Alive players");
  table.setHeading("Index", "Name");
  let tempDes = "";
  let alive = game.alivePlayers;
  for (player of alive) {
    //tempDes = tempDes + alive.indexOf(player) + " " + player.username +"\n";
    //console.log(alive.indexOf(player) + " " + player.username);
    table.addRow(alive.indexOf(player), player.username);
  }
  return table.toString();
}
function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
  return array;
}

module.exports = {
  init
};
