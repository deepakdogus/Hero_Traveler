import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import nodeCleanup from 'node-cleanup'
import initCore from '@hero/ht-core'
import cors from 'cors'
import routes from './routes'
import passport from './passport'
import {cleanup as apnCleanup} from './apn'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))
app.use(passport.initialize())

if (process.env.NODE_ENV !== 'development') {
  nodeCleanup(() => {
    apnCleanup()
  })
}


app.use(cors({
  origin: process.env.CORS_ORIGIN,
  optionsSuccessStatus: 200,
}))

routes(app)

// Final error handler
app.use((err, req, res, next) => {

  console.log(err)

  // @TODO implement standard-error
  res.statusCode = 500;

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
