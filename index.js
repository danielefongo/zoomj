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
      addRoom(config, params.slice(1)).catch(logError)
      break
    case 'remove':
      removeRoom(config, params.slice(1)).catch(logError)
      break
    default:
      joinRoom(config).catch(logError)
  }
}

function logError (it) { console.log(it.message)}

params = process.argv.slice(2)
execute(params)