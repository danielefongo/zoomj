const { exec } = require('child_process')

module.exports = class OpenCommand {
  async run (parameter) {
    return new Promise((resolve, reject) => {
      exec(`${this.command} "${parameter}"`, (error, out) => {
        if (error) reject()
        else resolve(out)
      })
    })
  }

  get command () {
    switch (process.platform) {
      case 'darwin':
        return 'open'
      case 'win32':
        return 'start'
      default:
        return 'xdg-open'
    }
  }
}
