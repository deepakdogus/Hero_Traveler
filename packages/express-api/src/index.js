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

// const apnProvider = new apn.Provider({
//   cert: path.resolve(path.join(__dirname, '../certificates/apn-cert.pem')),
//   key: path.resolve(path.join(__dirname, '../certificates/apn-key.pem'))
// })
//
// const user = '31510843c57c274c8888a785625a4bd8e4c2c69cbe252709cd2b2100bdc0acb9'
//
// let note = new apn.Notification({
//   alert: '2 Breaking news! I just send my first notification',
//   badge: 1,
//   sound: 'chime.caf'
// })
//
// note.topic = 'com.rehashstudio.herotraveler'
//
// console.log(`Sending: ${note.compile()} to ${user}`);
//
// apnProvider.send(note, user).then(result => {
//   console.log('result', result)
// })
//
// apnProvider.shutdown()

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
