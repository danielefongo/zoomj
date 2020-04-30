const OpenCommand = require('./open_command')

async function joinRoom (config, inquirer) {
  let room = await inquirer.chooseRoom(config.rooms)
  let conferenceNumber = room.room
  let password = room.password
  new OpenCommand().run(`zoommtg://zoom.us/join?action=join&confno=${conferenceNumber}&pwd=${password}`)
}

async function addRoom (config, inquirer) {
  let room = await inquirer.room(config)
  await config.add(room)
  config.store()
}

module.exports = { joinRoom, addRoom }