const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const User = require('@rwoody/ht-core').Models.User
const _ = require('lodash')

const initCore = require('@rwoody/ht-core').default
const PORT = process.env.PORT || 3000
const path = require('path')

/* Nunjucks config */ 
const express = require('express')
const nunjucks = require('nunjucks')
const app = express()
const messages = require('express-messages')
const flash = require('connect-flash')

/* settings for template rendering */ 

const pathToTemplates = path.resolve(__dirname, 'templates/')
const resultsPerPage = 15
const makeDateReadable = (dataArray) => {
  return dataArray.map(element => {
    element.createdString = element.createdAt.toDateString()
    return element
  })
}


// Middleware
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(morgan('dev'))
app.use()


nunjucks.configure(pathToTemplates, {
  autoescape: true,
  express: app,
  watch: true,
  cache: false
})


app.get('/users', (req, res) => {
  const query = req.query
  const page = Math.max(0, query.page || 0) // Defaults to zero in case query is undefined
  User.find({})
    .limit(resultsPerPage)
    .skip(page * resultsPerPage)
    .sort({[query.sortby]: query.direction || 1}) // Defaults to one in case query is undefined
    .then((data) => {
      data = makeDateReadable(data)
      res.render('users.njk', { data, sortby: query.sortby, page, direction: query.direction })
    })
})

app.get('/edit', (req, res) => {
  const { id } = req.query
  User.findById(id)
    .then((data) => res.render('edit.njk', { data }))
})

app.post('/edituser/:id', (req, res) => {
  const { email, username, role } = req.body
  const { id } = req.params
  console.log(req.body)

  
})

app.get('/', (req, res) => {
  res.render('index.njk')
})

// app.listen(3000, (req, res) => console.log('App listening on port 3000'))


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

