module.exports = class Config {
  constructor(file) {
    this.file = file
  }

  load() {
    let json = JSON.parse(this.file.load())
    if (!json || !Array.isArray(json.rooms)) throw Error("Invalid json")
    this.rooms = json.rooms
  }

  loadBasic() {
    this.rooms = []
  }

  add(room) {
    this.rooms.push(room)
  }

  remove(room) {
    this.rooms = this.rooms.filter(it => it.alias !== room.alias)
  }

  async store() {
    this.file.save(JSON.stringify({rooms: this.rooms}))
  }

  canAddAlias(alias) {
    return this.rooms.map(it => it.alias).filter(it => it === alias).length === 0
  }

  canAddRoom(room) {
    return this.rooms.map(it => it.room).filter(it => it === room).length === 0
  }
}
