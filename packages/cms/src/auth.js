import morgan from 'morgan'
import jwt from 'jsonwebtoken'
import {User} from '@hero/ht-core'
import express from 'express'

const authRouter = express.Router()
if ( process.env.NODE_ENV === 'development') {}

// jwt configuration

const jwtConfig = {
  expiresIn: 60 * 60 * 24 // token expires in 24 hours
}

authRouter.post('/', (req, res) => {
  User.validateCredentials(req.body.username, req.body.password)
  .then(validatedUser => {

    if (validatedUser.role !== 'admin') return Promise.reject(new Error('User is not an administrator!'))

    const token = jwt.sign(validatedUser, process.env.SECRET, jwtConfig)
    res.cookie('user', {
      username: validatedUser.username,
      success: true,
      message: 'User Authenticated',
      token
    }).status(200).redirect('/')
  })
  .catch(err => console.error('An error occurred: ', err))
})

const isAuthenticated = (req, res, next) => {
  let token
  if ( req.cookies.user ) token = req.cookies.user.token

  jwt.verify(token, process.env.SECRET,(err, decoded) => {
    if (err) res.status(403).send(err.message)
    if (decoded) next()
  })
}

module.exports = {
  authRouter,
  isAuthenticated
}
