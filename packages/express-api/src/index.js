import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import nodeCleanup from 'node-cleanup'
import initCore from '@hero/ht-core'
import cors from 'cors'
import routes from './routes'
import passport from './passport'
import busboy from 'connect-busboy'
import {cleanup as apnCleanup} from './apn'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(passport.initialize())
app.use(busboy({
  highWaterMark: 2 * 1024 * 1024,
}));

if (process.env.NODE_ENV !== 'development') {
  nodeCleanup(() => {
    apnCleanup()
  })
}

const whitelist = [
  process.env.CORS_ORIGIN,
  process.env.CORS_ORIGIN2,
  process.env.CORS_ORIGIN3,
  process.env.CORS_ORIGIN4,
  process.env.CORS_ORIGIN5,
]

app.use(cors({
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.options('*', cors())

routes(app)

// Final error handler
app.use((err, req, res, next) => {

  console.log(err)

  // @TODO implement standard-error
  res.statusCode = 500

  return res.json({
    message: err.message || 'There was an error processing your request.'
  })
})

initCore({
  mongoDB: process.env.MONGODB_URL,
  seedDB: process.env.SEED_DB,
}).then(() => {
  app.listen(PORT, err => {
    if (err) {
      console.error(err)
    } else {
      console.log(`App running on port ${PORT}`)
    }
  })
})
