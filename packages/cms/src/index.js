const dotenv = require('dotenv')
dotenv.config()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const User = require('@rwoody/ht-core').Models.User

const initCore = require('@rwoody/ht-core').default
const PORT = process.env.PORT || 3000
const path = require('path')


const express = require('express')
const nunjucks = require('nunjucks')
const app = express()

const pathToTemplates = path.resolve(__dirname, 'templates/')
const resultsPerPage = 15
const userData = {
  data: [
    {
      username: 'morty',
      email: 'morty@mortymail.com',
      createdAt: 'someDate',
      counts: {
        following: 33,
        followers: 12
      }
    },
    {
      username: 'sam peckinpaw',
      email: 'sam@thewildbunch.com',
      createdat: 'someotherdate',
      counts: {
        following: 1,
        followers: 12
      }
    },
    {
      username: 'Julia peckinpaw',
      email: 'julia@thewildbunch.com',
      createdat: 'somealsodate',
      counts: {
        following: 110000,
        followers: 12998176
      }
    }
  ]
}

// Middleware
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))


nunjucks.configure(pathToTemplates, {
  autoescape: true,
  express: app,
  watch: true,
  cache: false
})


app.get('/users', (req, res) => {
  const params = req.query
  const page = Math.max(0, params.page || 0)
  console.log(params)
  User.find({})
    .limit(resultsPerPage)
    .skip(page * resultsPerPage)
    .sort({username: params.direction || 1})
    .then((data) => {
      res.render('users.njk', { data, page: params.page, direction: params.direction })
    })
})

app.get('/', (req, res) => {
  res.render('index.njk', userData )
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

