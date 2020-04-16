const captureWebsite = require("capture-website");
const moment = require("moment");
const fs = require("fs");
const path = require('path');
const { sendErrorMail } = require('../../utils/utility')
let nonobad = [ 'data:', 'file://', 'doom3.zoy.org', 'ip', 'goatse', 'porn', 'redtube', 'sex', 'rule34', 'amateur', 'cuckold', 'creampie', 'cum', 'jiz', 'milf', 'orgasm', 'orgy', 'threesome', 'ass', 'tit', 'dick', 'penis', 'despacito', 'pussy', 'fuck', 'finger', 'bang', 'hentai', 'yaoi', 'virgin', 'handjob', 'blowjob', 'xxx', 'milf' ]
module.exports = {
  config: {
    name: "webshot",
    usage: "webshot",
    aliases: ["ws"],
    description: "Show screen shot of a given website",
    ownerOnly: false,
    enabled: true,
  },
  async run(client, message, args) {
    let options = {
      width: 1920,
      height: 1080,
      fullPage: true,
      cookies: [],
      timeout: 30, // add beforeScreenshot to filter out IP or something
      args: [
				'--no-sandbox',
				'--disable-setuid-sandbox'
			]
    };
    for(let word of nonobad) {
        if(message.content.includes(word)) return message.channel.send('NO NSFW BLYAT')
    }
    try {
    let a = await captureWebsite.buffer(args[0], options)
    await message.channel.send({
      files: [{ attachment: a, name: "file.png" }]
      })
    } catch (error) {
      sendErrorMail(error)
      return message.channel.send("Something went wrong");
    }
  },
};
