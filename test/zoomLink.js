const assert = require('assert')
const chai = require('chai')
const { deepEqual } = chai.assert

const ZoomLink = require('../src/zoomLink')

describe('ZoomUrlParser', () => {
  it('load url to room', () => {
    let roomId = "123"
    let password = "pwd"
    let zoomLink = new ZoomLink()

    let room = zoomLink.parse("alias", `https://us04web.zoom.us/j/${roomId}?pwd=${password}`)

    deepEqual(room, {
      alias: "alias",
      room: "123",
      password: "pwd"
    })
  })

  it('raise Error when cannot parse link', () => {
    let parser = new ZoomLink()

    assert.throws(() => {
      parser.parse("alias", "path?pwd=123")
    }, new Error("Cannot parse link."))

    assert.throws(() => {
      parser.parse("alias", "https://us04web.zoom.us/j/123")
    }, new Error("Cannot parse link."))
  })

  it('raise Error when no alias is provided', () => {
    let parser = new ZoomLink()

    assert.throws(() => {
      parser.parse(undefined, "any")
    }, new Error("Undefined alias."))

    assert.throws(() => {
      parser.parse("", "any")
    }, new Error("Undefined alias."))
  })

  it('generate url from room', () => {
    let roomId = "123"
    let password = "pwd"
    let parser = new ZoomLink()

    let room = {alias: "any", room: roomId, password: password}

    let url = parser.generate(room)

    deepEqual(url, `zoommtg://zoom.us/join?action=join&confno=${roomId}&pwd=${password}`)
  })

  it('raise Error when failing to generate url', () => {
    let parser = new ZoomLink()

    let room = {alias: "any"}

    assert.throws(() => {
      parser.generate(room)
    }, new Error("Cannot generate link."))
  })
})