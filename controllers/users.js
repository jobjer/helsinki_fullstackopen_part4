const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response) => {
  try {
    const { username, name, password } = request.body

    if (!(username && username.length >= 3)){
      response.status(404).send({error: 'username is mandatory and must be at least 3 characters long'}).end()
    }

    else if (!(password && password.length >= 3)){
      response.status(404).send({error: 'password is mandatory and must be at least 3 characters long'}).end()
    } else {
      const saltRounds = 10
      const passwordHash = await bcrypt.hash(password, saltRounds)

      const user = new User({
        username,
        name,
        passwordHash,
      })

      const savedUser = await user.save()

      response.status(201).json(savedUser)
    }
  } catch (error) {
    const errorMessage = error.errors.username.properties.message
    response.status(400).send({error: errorMessage})
  }
  
})

usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

module.exports = usersRouter