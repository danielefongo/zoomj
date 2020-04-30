const chai = require('chai')
const sinon = require('sinon')
const assert = require('assert')
const { deepEqual, lengthOf } = chai.assert

const Config = require('../src/config')

describe('Config', () => {
  let sandbox
  let inquirer
  let file

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    inquirer = new FakeInquirer()
    file = new FakeFile()
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('load from file', () => {
    let room = aRoom('myroom', '123', 'pwd')

    sandbox.stub(file, 'load').returns(asString({rooms: [room]}))

    let config = new Config(inquirer, file)

    deepEqual(config.rooms, [room])
  })

  it('raise error when loading invalid file', () => {
    assert.throws(() => {
      sandbox.stub(file, 'load').returns(asString({}))
      new Config(inquirer, file)
    }, Error)

    assert.throws(() => {
      sandbox.stub(file, 'load').returns(null)
      new Config(inquirer, file)
    }, Error)

    assert.throws(() => {
      sandbox.stub(file, 'load').returns({rooms: "wtf"})
      new Config(inquirer, file)
    }, Error)
  })

  it('store to file', () => {
    let room = aRoom('myroom', '123', 'pwd')

    sandbox.stub(file, 'load').returns(asString({rooms: [room]}))
    let saveStub = sandbox.stub(file, 'save')

    let config = new Config(inquirer, file)
    config.store()

    lengthOf(saveStub.getCalls(), 1)
    deepEqual(saveStub.firstCall.args[0], asString({rooms: [room]}))
  })

  it('add new room', async () => {
    let new_room = aRoom('myroom', '123', 'pwd')

    sandbox.stub(file, 'load').returns(asString({rooms: []}))
    sandbox.stub(inquirer, 'room').returns(resolved(new_room))

    let config = new Config(inquirer, file)

    await config.add()

    deepEqual(config.rooms, [new_room])
  }).timeout(100)

  it('validate configurations', () => {
    let rooms = [
      aRoom('my room alias', 'my room', 'pwd')
    ]

    sandbox.stub(file, 'load').returns(asString({rooms: rooms}))

    let config = new Config(inquirer, file)

    deepEqual(config.canAddAlias('my room alias'), false)
    deepEqual(config.canAddAlias('new room alias'), true)
    deepEqual(config.canAddRoom('my room'), false)
    deepEqual(config.canAddRoom('new room'), true)
  }).timeout(100)
})

class FakeInquirer {
  async room (config) {}
}

class FakeFile {
  load () {}
  save (data) {}
}

function aRoom (alias, room, password) {
  return { alias, room, password }
}

function resolved(result) {
  return new Promise((resolve, reject) => {resolve(result)})
}

function asString(obj) {return JSON.stringify(obj)}