#!/usr/bin/env node

const { addRoom, joinRoom } = require('./src/functions')
const Inquirer = require('./src/inquirer')
const Config = require('./src/config')
const File = require('./src/file')

const path = require('path')
const { homedir } = require('os')
const configFile = path.join(homedir(), '.zoomj.json')

async function execute (command) {
  let inquirer = new Inquirer()
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
      await addRoom(config, inquirer)
      break
    default:
      await joinRoom(config, inquirer)
  }
}

command = process.argv.slice(2)[0]
execute(command)