const url = require('url')

module.exports = class ZoomLink {
  parse (alias, link) {
    let result = url.parse(link, true)

    if (!alias) throw new Error('Undefined alias.')
    return {
      alias: alias,
      room: this.roomIdFrom(result.pathname),
      password: this.passwordFrom(result.query)
    }
  }

  generate(room) {
    if(!room || !room.room || !room.password) throw new Error('Cannot generate link.')
    let conferenceNumber = room.room
    let password = room.password
    return `zoommtg://zoom.us/join?action=join&confno=${conferenceNumber}&pwd=${password}`
  }

  invitation(room) {
    if(!room || !room.room || !room.password) throw new Error('Cannot generate link.')
    let conferenceNumber = room.room
    let password = room.password
    return `https://us04web.zoom.us/j/${conferenceNumber}?pwd=${password}`
  }

  passwordFrom (query) {
    if (!query || !query.pwd) throw new Error('Cannot parse link.')
    return query.pwd
  }

  roomIdFrom (path) {
    if (!path.match(new RegExp('/j/[0-9]+$'))) throw new Error('Cannot parse link.')
    return path.split('/')[2]
  }
}
