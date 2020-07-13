const mongoose = require('mongoose')
const { string } = require('mathjs')
const { Message } = require('discord.js')
const muteSchema = mongoose.Schema({
  username: {
    type: String
  },
  id: {
    type: String
  },
  discriminator: {
    type: String
  },
  guildID: {
    type: String
  }
})
const mute = mongoose.model('mute', muteSchema)

const add = async (user) => {
  const muted = new mute({
    username: user.username,
    id: user.id,
    discriminator: user.discriminator,
    guildID: user.guildID
  })
  return muted.save()
}
const exist = async (user) => {
  const query = await mute.find({ id: user.id, guildID: user.guildID })
  return query
}
const remove = async (user) => {
  const query = await mute.deleteOne({ id: user.id, guildID: user.guildID })
  return query
}

const list = async (guildID) => {
  const query = await mute.find({ guildID: guildID })
  return query
}
module.exports = { add, exist, remove, list }
