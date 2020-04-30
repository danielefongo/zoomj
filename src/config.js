module.exports = class Config {
  constructor(inquirer, file) {
    this.inquirer = inquirer
    this.file = file

    let json = file.load()
    if (!json || !Array.isArray(json.rooms)) throw Error("Invalid json")
    this.rooms = json.rooms
  }

  async add() {
    let room = await this.inquirer.room()
    this.rooms.push(room)
  }

  async store() {
    this.file.save({rooms: this.rooms})
  }
}
