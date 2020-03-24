let mongoose = require("mongoose");
let roleSchema = mongoose.Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  roles: { type: Array, default: [] }
});
var role = mongoose.model("role", roleSchema);

async function addUser(userID, roles) {
  await role.findOne({ userID: userID }, async function(error, result) {
    if (error) console.log(error);
    if (result) {
      role.findOneAndUpdate(
        { userID: userID },
        { roles: roles },
        async function(error, doc, res) {
          if (error) console.log(error);
        }
      );
    }
    if (!result) {
      let user = new role({
        userID: userID,
        roles: roles
      });
      await user.save().then(() => {
        console.log("saved new roles");
      });
    }
  });
}
async function queryRoles(userID) {
  let f = await role.findOne({ userID: userID });
  return f;
}
module.exports = { addUser, queryRoles };
