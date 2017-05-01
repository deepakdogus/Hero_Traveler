import dotenv from 'dotenv'
dotenv.config()
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import apn from 'apn'
import initCore from '@rwoody/ht-core'
import routes from './routes'
import passport from './passport'

const app = express()
const PORT = process.env.PORT || 3000

const apnProvider = new apn.Provider({
  cert: path.resolve('../certificates/apn-cert.pem'),
  key: path.resolve('../certificates/apn-key.pem')
})

// Middleware
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))

app.use(passport.initialize())

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
