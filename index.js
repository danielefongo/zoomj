#!/usr/bin/env node

const OpenCommand = require('./src/open_command')

args = process.argv.slice(2)

if (args.length < 2) {
  console.log("usage: zoomj <conference-number> <password>")
  return
}

let conferenceNumber = args[0]
let password = args[1]

let url = `zoommtg://zoom.us/join?action=join&confno=${conferenceNumber}&pwd=${password}`

new OpenCommand().run(url)