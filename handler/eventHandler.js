const fs = require('fs');
const path = require('path');
module.exports = client => {
    const eventPath = './events/';
    let events = fs.readdirSync(eventPath).filter(file => file.endsWith('.js'));
    events.forEach(event => {
        event = event.replace(/\.js$/i, '');
        if (event === 'ready') {
            client.on(event, (client) => require(path.resolve(eventPath, event)))
        }
        client.on(event, require(path.resolve(eventPath, event)));
    })
}