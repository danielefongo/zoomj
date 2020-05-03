const OpenCommand = require('./open_command')
const Inquirer = require('./inquirer')

async function joinRoom (config) {
  let inquirer = new Inquirer()
  let room = await inquirer.chooseRoom(config.rooms)
  let conferenceNumber = room.room
  let password = room.password
  new OpenCommand().run(`zoommtg://zoom.us/join?action=join&confno=${conferenceNumber}&pwd=${password}`)
}

async function addRoom (config) {
  let inquirer = new Inquirer()
  let room = await inquirer.room(config)
  await config.add(room)
  config.store()
}

async function removeRoom (config) {
  let inquirer = new Inquirer()
  let room = await inquirer.chooseRoom(config.rooms)
  await config.remove(room)
  config.store()
}

module.exports = { joinRoom, addRoom, removeRoom }