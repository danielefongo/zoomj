const assert = require('assert')
const chai = require('chai')
const { deepEqual } = chai.assert

const ZoomLinkParser = require('../src/zoomLinkParser')

describe('ZoomUrlParser', () => {
  it('load url to room', () => {
    let roomId = "123"
    let password = "pwd"
    let parser = new ZoomLinkParser()

    let room = parser.parse("alias", `https://us04web.zoom.us/j/${roomId}?pwd=${password}`)

    deepEqual(room, {
      alias: "alias",
      room: "123",
      password: "pwd"
    })
  })

  it('raise Error when cannot parse link', () => {
    let parser = new ZoomLinkParser()

    assert.throws(() => {
      parser.parse("alias", "path?pwd=123")
    }, new Error("Cannot parse link."))

    assert.throws(() => {
      parser.parse("alias", "https://us04web.zoom.us/j/123")
    }, new Error("Cannot parse link."))
  })

  it('raise Error when no alias is provided', () => {
    let parser = new ZoomLinkParser()

    assert.throws(() => {
      parser.parse(undefined, "any")
    }, new Error("Undefined alias."))
  })
})