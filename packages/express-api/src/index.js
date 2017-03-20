import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import initCore from '@rwoody/ht-core'
import routes from './routes'
import passport from './passport'

const app = express()
const PORT = process.env.PORT || 3000

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

const stageDBUrl = 'mongodb://ht-api:lFMGJtlEO13MV5qd4GBa0wjkQLiteVq9n1pyQChp3aRgH@ds161008.mlab.com:61008/hero-traveler'

initCore({
  mongoDB: process.env.NODE_ENV === 'development' ? process.env.MONGODB_URL : stageDBUrl,
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
