const mongoose = require('mongoose')

const roleSchema = mongoose.Schema({
  roleID: {
    type: String,
    required: true
  },
  guildID: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})
const role = mongoose.model('role', roleSchema)

const add = async (roleID, guildID, type) => {
  const toAdd = new role({
    guildID: guildID,
    roleID: roleID,
    type: type
  })
  return toAdd.save()
}

const remove = async (roleID, guildID) => {
  const toRemove = role.findOneAndDelete({
    guildID: guildID,
    roleID: roleID,
    type: type
  })
  return toRemove
}

const get = async (roleID, guildID, type) => {
  const data = role.find({ guildID: guildID, roleID: roleID, type: type })
  return data
}

const getByType = async (type) => {
  const data = role.find({ type: type })
  return data
}

module.exports = {
  add,
  remove,
  get,
  getByType
}
