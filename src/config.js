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

  search(roomAlias) {
    return this.rooms.filter(it => it.alias === roomAlias)[0]
  }

  add(room) {
    if(!this.canAddAlias(room.alias) || !this.canAddRoom(room)) throw new Error("Duplicated room.")
    this.rooms.push(room)
  }

  remove(roomAlias) {
    if (! this.search(roomAlias)) throw new Error("Not existing room.")
    this.rooms = this.rooms.filter(it => it.alias !== roomAlias)
  }

  async store() {
    this.file.save(JSON.stringify({rooms: this.rooms}, null, 2))
  }

  canAddAlias(alias) {
    return this.rooms.map(it => it.alias).filter(it => it === alias).length === 0
  }

  canAddRoom(room) {
    return this.rooms.map(it => it.room).filter(it => it === room).length === 0
  }
}
