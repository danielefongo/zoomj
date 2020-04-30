const fs = require('fs')

module.exports = class File {
  constructor (location) {
    this.location = location
  }

  load() {
    try {
      return fs.readFileSync(this.location).toString()
    } catch {
      throw Error(`Cannot load ${this.location}.`)
    }
  }

  save(data) {
    try {
      return fs.writeFileSync(this.location, data)
    } catch {
      throw Error(`Cannot save ${this.location}.`)
    }
  }
}
