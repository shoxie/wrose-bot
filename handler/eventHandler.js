const fs = require('fs')
const path = require('path')
module.exports = client => {
  const eventPath = './events/'
  const events = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'))
  events.forEach(event => {
    event = event.replace(/\.js$/i, '')
    // if (event === 'ready') {
    //     let eventObj=require(path.resolve(eventPath, event))(client);
    //     client.on(event, eventObj)
    // }
    // client.on(event, require(path.resolve(eventPath, event)));
    const eventObj = require(path.resolve(eventPath, event))(client)
    client.on(event, eventObj)
  })
}
