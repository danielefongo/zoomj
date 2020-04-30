module.exports = class Inquirer {
  constructor () {
    this.instance = require('inquirer')
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
        type: 'list',
        name: 'room',
        message: 'Select room',
        choices: choices
      }])

    return rooms.filter(it => it === answer.room)[0]
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
