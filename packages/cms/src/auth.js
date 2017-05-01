const morgan = require('morgan')
const User = require('@rwoody/ht-core').Models.User
const jwt = require('jsonwebtoken')

const PORT = process.env.PORT || 3000
const path = require('path')

const authRouter = require('express').Router()

// jwt configuration
const jwtConfig = {
  expiresIn: 60*60*24 // token expires in 24 hours
}



authRouter.post('/', (req, res) => {
  console.log('req.body', req.body)
  User.findOne({username: req.body.username})

  // User.validateCredentials(req.body.username, req.body.password)

    .then(validatedUser => {
      // if (user.role !== 'admin') return Promise.reject(new Error('User is not an administrator!'))

      const token = jwt.sign(validatedUser, process.env.SECRET, jwtConfig)
      console.log('token', token)

      res.cookie({
        success: true,
        message: 'Here is a token!',
        token
      })
    })
    .catch(err => console.error('An error occurred: ', err))
})

const isAuthenticated = (req, res, next) => {
  if (req.user.authenticated) return next()
  res.status('401').redirect('/')
}


module.exports = {
  authRouter,
  isAuthenticated
}





