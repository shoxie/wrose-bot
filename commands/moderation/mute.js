let roleModel = require("../../model/roles.model");
module.exports = {
  config: {
    name: "mute",
    usage: "mute [user] [time] [reason]",
    description: "Mute a specific person",
    ownerOnly: false,
    enabled: true
  },
  async run(client, message, args) {
    //variables
    const muteRole = message.guild.roles.cache.find(x => x.name === "Muted");
    let id = message.mentions.users.first();
    let user = await message.guild.members.cache.get(id.id);
    let knownRoles = [];
    //return if member has no permission
    if (!message.member.hasPermission("MANAGE_GUILD"))
      return message.channel.send("Đừng cố tạo phản nữa.");
    //check variables
    if (!id) return message.channel.send("Specific a user !");
    if (!parseInt(args[1])) return message.channel.send("Invalid time input.");
    //processing
    if (!muteRole) {
      let tempRole = await message.guild.roles.create({
        data: {
          name: "Muted",
          color: "#000000",
          permissions: []
        },
        reason: "Mute role"
      });
      addMute(tempRole);
    }
    if (muteRole) {
      addMute(muteRole);
    }
    async function addMute(role) {
      //console.log(user);
      if (user.roles) {
        user.roles.cache.forEach(role => {
          knownRoles.push(role.id);
        });
        await user.roles.remove(knownRoles);
      }
      await user.roles.add(role);
      message.guild.channels.cache.forEach(async (channel, id) => {
        await channel.updateOverwrite(role, {
          SEND_MESSAGES: false,
          ADD_REACTION: false,
          SPEAK: false
        });
      });
      if (user.voice.channel) {
        disconnectUser();
      }
      message.channel.send({
        embed: {
          color: 15158332,
          title: "User muted",
          description: message.author.tag + " muted a user",
          fields: [
            {
              name: "Muted user",
              value: id.tag
            },
            {
              name: "Duration",
              value: secondsCoverter(args[1])
            }
          ]
        }
      });
      setTimeout(async function() {
        await user.roles.remove(role.id);
        await user.roles.add(knownRoles);
        knownRoles = [];
        message.channel.send({
          embed: {
            color: 3066993,
            title: "Unmuted",
            description: "User unmuted",
            fields: [
              {
                name: "Username",
                value: id.tag
              },
              {
                name: "Mute duration",
                value: secondsCoverter(args[1])
              }
            ]
          }
        });
      }, args[1] * 1000);
    }
    async function roleChanger(mutedRole) {
      user.roles.cache.forEach(role => {
        knownRoles.push(role.id);
      });
      await user.roles.remove(knownRoles);
      await user.roles.add(mutedRole.id);
    }
    async function disconnectUser() {
      let findVoice = await message.guild.channels.cache.find(
        x => x.name === "temp"
      );
      if (findVoice) {
        await user.voice.setChannel(findVoice.id);
        findVoice.delete();
      } else {
        try {
          let tempVoice = await message.guild.channels.create("temp", {
            type: "voice"
          });
          await user.voice.setChannel(tempVoice.id);
          tempVoice.delete();
        } catch (error) {
          // console.log(error);
          message.channel.send({
            embed: {
              color: 15158332,
              title: error.message
            }
          });
        }
      }
    }
    function secondsCoverter(second) {
      second = Number(second);
      var m = Math.floor((second % 3600) / 60);
      var s = Math.floor((second % 3600) % 60);

      return m + ":" + s;
    }
  }
};
