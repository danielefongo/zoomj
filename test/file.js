const fs = require('fs')

const chai = require('chai')
const sinon = require('sinon')
const assert = require('assert')
const { deepEqual } = chai.assert

const File = require('../src/file')

describe('File', () => {
  let sandbox
  let readStub
  let writeStub

  beforeEach(() => {
    sandbox = sinon.createSandbox()
    readStub = sandbox.stub(fs, 'readFileSync')
    writeStub = sandbox.stub(fs, 'writeFileSync')
  })

  afterEach(() => {
    sandbox.restore()
  })

  it('load existing file', () => {
    readStub.returns(asBuffer("text"))

    let file = new File("/foo")

    deepEqual(file.load(), "text")
    deepEqual(readStub.firstCall.args[0], '/foo')
  })

  it('throw error when failing to load file', () => {
    let file = new File("/foo")

    assert.throws(() => {
      readStub.throws(new Error("any"))
      file.load()
    }, new Error("Cannot load /foo."))
  })

  it('save existing file', () => {
    let file = new File("/foo")

    file.save({})
    deepEqual(writeStub.firstCall.args[0], '/foo')
    deepEqual(writeStub.firstCall.args[1], {})
  })

  it('throw error when failing to save file', () => {
    let file = new File("/foo")

    assert.throws(() => {
      writeStub.throws(new Error("any"))
      file.save()
    }, new Error("Cannot save /foo."))
  })
})

function asBuffer(string) {return Buffer.from(string);}