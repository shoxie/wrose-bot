const translate = require('translate-google')
const { blueMessage } = require('../../utils/message')
module.exports = {
  config: {
    name: 'translate',
    usage: 'translate',
    aliases: [],
    description: 'translate a word to another language',
    ownerOnly: false,
    enabled: true
  },
  async run (client, message, args) {
    await message.channel.send('Input a text you want to translate')
    const collected = await message.channel.awaitMessages(
      (m) => m.author.id === message.author.id,
      {
        max: 1,
        time: 30000
      }
    )
    const text = collected.first().content
    if (!text) return message.reply('Stop spamming')
    await blueMessage(
      message,
      'Available language codes',
      'ar, az, be, bg, bn, bs, cs, da, de, dz, el, en, en-gb, en-us, es, et, fa, fi, fil, fr, he, hi, hr, hu, hy, id, is, it, ja, ka, kk, km, ko, lb, lo, lt, lv, mk, mn, ms, my, ne, no, pl, pt, ro, ru, sk, sl, sq, sr, sv, sw, th, tk, uk, vi, zh'
    )
    const collect = await message.channel.awaitMessages(
      (m) => m.author.id === message.author.id,
      {
        max: 1,
        time: 30000
      }
    )
    const code = collect.first().content
    if (!code) return message.reply('Stop spamming')
    const translated = await translate(text, { to: code })
    blueMessage(message, 'Translated to ' + code, translated)
  }
}
