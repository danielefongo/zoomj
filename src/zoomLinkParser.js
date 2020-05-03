const url = require('url')

module.exports = class ZoomLinkParser {
  parse (alias, link) {
    let result = url.parse(link, true)

    if (!alias) throw new Error('Undefined alias.')
    return {
      alias: alias,
      room: this.roomIdFrom(result.pathname),
      password: this.passwordFrom(result.query)
    }
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
