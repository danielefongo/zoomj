#!/usr/bin/env node

const { addRoom, joinRoom, removeRoom } = require('./src/functions')
const Config = require('./src/config')
const File = require('./src/file')

const path = require('path')
const { homedir } = require('os')
const configFile = path.join(homedir(), '.zoomj.json')

async function execute (params) {
  let command = params[0]
  let file = new File(configFile)
  let config = new Config(file)

  try {
    config.load()
  } catch {
    console.log('Cannot load config. Creating basic setup.')
    config.loadBasic()
  }

  switch (command) {
    case 'add':
      await addRoom(config)
      break
    case 'remove':
      await removeRoom(config)
      break
    default:
      await joinRoom(config)
  }
}

params = process.argv.slice(2)
execute(params)