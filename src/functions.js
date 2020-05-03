const OpenCommand = require('./open_command')
const Inquirer = require('./inquirer')
const ZoomLinkParser = require('./zoomLinkParser')

async function joinRoom (config) {
  let inquirer = new Inquirer()
  let room = await inquirer.chooseRoom(config.rooms)
  let conferenceNumber = room.room
  let password = room.password
  new OpenCommand().run(`zoommtg://zoom.us/join?action=join&confno=${conferenceNumber}&pwd=${password}`)
}

async function addRoom (config, params) {
  let room
  if (Array.isArray(params) && params.length === 2) {
    let parser = new ZoomLinkParser()
    room = parser.parse(params[0], params[1])
  } else {
    let inquirer = new Inquirer()
    room = await inquirer.room(config)
  }
  await config.add(room)
  config.store()
}

async function removeRoom (config, params) {
  let alias
  if (Array.isArray(params) && params.length === 1) {
    alias = params[0]
  } else {
    let inquirer = new Inquirer()
    room = await inquirer.chooseRoom(config.rooms)
    alias = room.alias
  }
  await config.remove(alias)
  config.store()
}

module.exports = { joinRoom, addRoom, removeRoom }