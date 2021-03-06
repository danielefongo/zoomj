const chai = require('chai')
const sinon = require('sinon')
const assert = require('assert')
const { deepEqual, lengthOf } = chai.assert

const Config = require('../src/config')

describe('Config', () => {
  let sandbox
  let file

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    file = new FakeFile()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('load from file', () => {
    let room = aRoom('myroom', '123', 'pwd')

    sandbox.stub(file, 'load').returns(asString({rooms: [room]}))

    let config = new Config(file)
    config.load()

    deepEqual(config.rooms, [room])
  })

  it('raise error when loading invalid file', () => {
    let config = new Config(file)

    assert.throws(() => {
      sandbox.stub(file, 'load').returns(asString({}))
      config.load()
    }, Error)

    assert.throws(() => {
      sandbox.stub(file, 'load').returns(null)
      config.load()
    }, Error)

    assert.throws(() => {
      sandbox.stub(file, 'load').returns({rooms: "wtf"})
      config.load()
    }, Error)
  })

  it('store to file', () => {
    let room = aRoom('myroom', '123', 'pwd')

    sandbox.stub(file, 'load').returns(asString({rooms: [room]}))
    let saveStub = sandbox.stub(file, 'save')

    let config = new Config(file)
    config.load()
    config.store()

    lengthOf(saveStub.getCalls(), 1)
    deepEqual(saveStub.firstCall.args[0], asString({rooms: [room]}))
  })

  it('add new room', () => {
    let new_room = aRoom('myroom', '123', 'pwd')

    sandbox.stub(file, 'load').returns(asString({rooms: []}))

    let config = new Config(file)
    config.load()

    config.add(new_room)

    deepEqual(config.rooms, [new_room])
  })

  it('search room', () => {
    let room = aRoom('myroom', '123', 'pwd')

    sandbox.stub(file, 'load').returns(asString({rooms: [room]}))

    let config = new Config(file)
    config.load()

    deepEqual(config.search("myroom"), room)
    deepEqual(config.search("notexisting"), undefined)
  })

  it('deny adding new room if duplicated', () => {
    let new_room = aRoom('myroom', '123', 'pwd')

    sandbox.stub(file, 'load').returns(asString({rooms: [aRoom('myroom', '123', 'pwd')]}))

    let config = new Config(file)
    config.load()

    assert.throws(() => {
      config.add(new_room)
    }, new Error("Duplicated room."))
  })

  it('remove room', () => {
    let room = aRoom('myroom', '123', 'pwd')

    sandbox.stub(file, 'load').returns(asString({rooms: [room]}))

    let config = new Config(file)
    config.load()

    config.remove("myroom")

    deepEqual(config.rooms, [])
  })

  it('deny removing room if not existing', () => {
    sandbox.stub(file, 'load').returns(asString({rooms: []}))

    let config = new Config(file)
    config.load()

    assert.throws(() => {
      config.remove("roomAlias")
    }, new Error("Not existing room."))
  })

  it('validate configurations', () => {
    let rooms = [
      aRoom('my room alias', 'my room', 'pwd')
    ]

    sandbox.stub(file, 'load').returns(asString({rooms: rooms}))

    let config = new Config(file)
    config.load()

    deepEqual(config.canAddAlias('my room alias'), false)
    deepEqual(config.canAddAlias('new room alias'), true)
    deepEqual(config.canAddRoom('my room'), false)
    deepEqual(config.canAddRoom('new room'), true)
  }).timeout(100)
})

class FakeFile {
  load () {}
  save (data) {}
}

function aRoom (alias, room, password) {
  return { alias, room, password }
}

function asString(obj) {return JSON.stringify(obj, null, 2)}