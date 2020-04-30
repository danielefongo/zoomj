const fuzzysort = require('fuzzysort')

module.exports = class Inquirer {
  constructor () {
    this.instance = require('inquirer')
    this.instance.registerPrompt('autocomplete-list', require('inquirer-autocomplete-prompt'))
  }

  async room (config) {
    return this.instance.prompt([
      {
        type: 'input',
        name: 'alias',
        message: 'Insert alias',
        validate: this.validate(config.canAddAlias.bind(config))
      },
      {
        type: 'input',
        name: 'room',
        message: 'Insert room number',
        validate: this.validate(config.canAddRoom.bind(config))
      },
      {
        type: 'input',
        name: 'password',
        message: 'Insert password'
      }
    ])
  }

  async chooseRoom (rooms) {
    const choices = this.toChoices(rooms)

    let answer = await this.instance.prompt([
      {
        type: 'autocomplete-list',
        name: 'room',
        message: 'Select room',
        source: (_, id) => this.search(choices, id)
      }])

    return rooms.filter(it => it === answer.room)[0]
  }

  async search (objects, keyword) {
    if (keyword === undefined || keyword === '') return objects
    return fuzzysort.go(keyword, objects, { key: 'name' }).map(it => it.obj)
  }

  toChoices (rooms) {
    return rooms.map(it => {
      return {
        name: it.alias,
        value: it
      }
    })
  }

  validate (validator) {
    return function (data) {
      if (!validator(data)) return 'Duplicated.'
      return true
    }
  }
}
