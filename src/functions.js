const OpenCommand = require('./openCommand')
const Inquirer = require('./inquirer')
const ZoomLinkParser = require('./zoomLink')

async function joinRoom (config, params) {
  let room
  if (Array.isArray(params) && params.length === 1) {
    let alias = params[0]
    room = config.search(alias)
  } else {
    let inquirer = new Inquirer()
    room = await inquirer.chooseRoom(config.rooms)
  }

  let zoomLink = new ZoomLinkParser()
  let url = zoomLink.generate(room)
  new OpenCommand().run(url)
}

async function addRoom (config, params) {
  let room
  if (Array.isArray(params) && params.length === 2) {
    let zoomLink = new ZoomLinkParser()
    room = zoomLink.parse(params[0], params[1])
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