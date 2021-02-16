const clipboardy = require('clipboardy')

module.exports = class CopyCommand {
  run (text) { clipboardy.writeSync(text) }
}
