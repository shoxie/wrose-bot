const { createCanvas } = require('canvas')
function wrapText (ctx, text, maxWidth) {
  return new Promise((resolve) => {
    if (ctx.measureText(text).width < maxWidth) return resolve([text])
    if (ctx.measureText('W').width > maxWidth) return resolve(null)
    const words = text.split(' ')
    const lines = []
    let line = ''
    while (words.length > 0) {
      let split = false
      while (ctx.measureText(words[0]).width >= maxWidth) {
        const temp = words[0]
        words[0] = temp.slice(0, -1)
        if (split) {
          words[1] = `${temp.slice(-1)}${words[1]}`
        } else {
          split = true
          words.splice(1, 0, temp.slice(-1))
        }
      }
      if (ctx.measureText(`${line}${words[0]}`).width < maxWidth) {
        line += `${words.shift()} `
      } else {
        lines.push(line.trim())
        line = ''
      }
      if (words.length === 0) lines.push(line.trim())
    }
    return resolve(lines)
  })
}
const Colors = {
  DEFAULT: '0',
  AQUA: '1abc9c',
  GREEN: '2ecc71',
  BLUE: '3498db',
  PURPLE: '9b59b6',
  GOLD: 'f1c40f',
  ORANGE: 'e67e22',
  RED: 'e74c3c',
  GREY: '95a5a6',
  DARKER_GREY: '7f8c8d',
  NAVY: '34495e',
  DARK_AQUA: '11806a',
  DARK_GREEN: '1f8b4c',
  DARK_BLUE: '206694',
  DARK_PURPLE: '71368a',
  DARK_GOLD: 'c27c0e',
  DARK_ORANGE: 'a84300',
  DARK_RED: '992d22',
  DARK_GREY: '979c9f',
  LIGHT_GREY: 'bcc0c0',
  DARK_NAVY: '2c3e50',
  LUMINOUS_VIVID_PINK: 'fd0061',
  DARK_VIVID_PINK: 'bc0057',
  CUSTOM: '2b2c36',
  G_TRANSLATE: '4989f4',
  GITHUB: '282828',
  IMDB: 'f3ce13',
  INSTAGRAM: 'e1306c',
  MAL: '2e51a2',
  NPM: 'cc3534',
  STEAM: '2a475e',
  YOUTUBE: 'c4302b',
  WIKIPEDIA: '6b6b6b'
}
module.exports = {
  wrapText,
  Colors
}
