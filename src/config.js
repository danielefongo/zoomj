module.exports = class Config {
  constructor(inquirer, file) {
    this.inquirer = inquirer
    this.file = file

    let json = file.load()
    if (!json || !Array.isArray(json.rooms)) throw Error("Invalid json")
    this.rooms = json.rooms
  }

  async add() {
    let room = await this.inquirer.room(this)
    this.rooms.push(room)
  }

  async store() {
    this.file.save({rooms: this.rooms})
  }

  canAddAlias(alias) {
    return this.rooms.map(it => it.alias).filter(it => it === alias).length === 0
  }

  canAddRoom(room) {
    return this.rooms.map(it => it.room).filter(it => it === room).length === 0
  }
}
