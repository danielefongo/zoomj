#!/usr/bin/env node

const { exec } = require("child_process");

function run(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, out) => {
      if (error) reject()
      else resolve(out)
    });
  })
}

function openCommand() {
  switch(process.platform) {
    case 'darwin': return 'open'
    case 'win32': return 'start'
    default: return 'xdg-open'
  }
}

args = process.argv.slice(2)

if (args.length < 2) {
  console.log("usage: zoomj <conference-number> <password>")
  return
}

let conferenceNumber = args[0]
let password = args[1]

let url = `zoommtg://zoom.us/join?action=join&confno=${conferenceNumber}&pwd=${password}`

run(`${openCommand()} "${url}"`)