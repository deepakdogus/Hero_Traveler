import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import routes from './routes'

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))

routes(app)

app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`App running on port ${PORT}`)
  }
})
