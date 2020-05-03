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
    if(!this.canAddAlias(room.alias) || !this.canAddRoom(room)) throw new Error("Duplicated room.")
    this.rooms.push(room)
  }

  remove(roomAlias) {
    let newRooms = this.rooms.filter(it => it.alias !== roomAlias)
    if (newRooms.length === this.rooms.length) throw new Error("Not existing room.")
    this.rooms = newRooms
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
