const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("./data/commands.json");
const db = low(adapter);
const fs = require('fs')
module.exports = client => {
    return function(){
    console.log('done loading');
    // db.defaults({
    //     commands: []
    // }).write();
    // fs.readdirSync("./commands/").forEach(dir => {
    //     let catagory = db.get('commands').find({
    //         catagory: dir
    //     }).value();
    //     if (!catagory) {
    //         db.get('commands').push({
    //             catagory: dir,
    //             list: []
    //         }).write()
    //     }
    //     const catagories = fs.readdirSync(`./commands/${dir}/`).filter(file => {
    //         // db.get('commands').find({
    //         //     catagory: dir
    //         // }).get('list').push({
    //         //     file
    //         // })
    //         file.endsWith(".js");
    //         var filename = file.split('.').slice(0, -1).join('.')
    //         let module = db.get('commands').find({
    //             catagory: dir
    //         }).get('list').find({
    //             name: filename
    //         }).value();
    //         if (!module) {
    //             db.get('commands')
    //                 .find({
    //                     catagory: dir
    //                 })
    //                 .get('list')
    //                 .push({
    //                     name: filename
    //                 }).write()
    //         }
    //     });
    // });
}
}