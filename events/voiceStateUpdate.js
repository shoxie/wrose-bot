module.exports = client => {
  return async function(oldMember, newMember) {
      const serverQueue = client.queue.get(newMember.guild.id)
  };
};
