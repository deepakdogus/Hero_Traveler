const dotenv = require('dotenv')
dotenv.config()
if ( process.env.NODE_ENV === 'development') {
  require('babel-register')
  require('babel-polyfill')
}

const bodyParser = require('body-parser')
const morgan = require('morgan')
const Models = require('@rwoody/ht-core').Models
const _ = require('lodash')

const initCore = require('@rwoody/ht-core').default
const PORT = process.env.PORT || 3000
const path = require('path')

/* Nunjucks config */
const express = require('express')
const nunjucks = require('nunjucks')
const app = express()
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const session = require('express-session')

/* settings for template rendering */

const pathToTemplates = path.resolve(__dirname, 'templates/')
const resultsPerPage = 15
const multer = require('./multer.js')
const auth = require('./auth.js')
const makeDateReadable = (dataArray) => {
  return dataArray.map(element => {
    if (element.createdAt) {
      element.createdString = element.createdAt.toDateString()
    } else {
      element.createdString = new Date().toDateString()
    }
    return element
  })
}

const parseTable = (tableUrl) => {
  if (tableUrl === 'users') return 'User'
  if (tableUrl === 'categories') return 'Category'
  if (tableUrl === 'stories') return 'Story'
  throw new Error('The table url doesn\'t match any collection in the DB!')
}


app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: true}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/authenticate', auth)



nunjucks.configure(pathToTemplates, {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== 'production',
  cache: process.env.NODE_ENV === 'production'
})

app.get('/:table', (req, res) => {
  const { table } = req.params
  const dbTable = parseTable(table)
  const { direction, sortby } = req.query
  const page = Math.max(0, req.query.page || 0) // Defaults to zero in case query is undefined
  Models[dbTable].find()
    .limit(resultsPerPage)
    .skip(page * resultsPerPage)
    .populate('author')
    .sort({[sortby]: direction || 1}) // Defaults to one in case query is undefined
    .then((data) => {
      data = makeDateReadable(data)
      res.render(`${req.params.table}.njk`, { data, table, sortby, page, direction }
      )
    })
})

app.get('/:table/edit', (req, res) => {
  const { id } = req.query
  const dbTable = parseTable(req.params.table)
  Models[dbTable].findById(id)
    .then((data) => res.render(`edit-${req.params.table}.njk`, { data }))
})

app.get('/:table/create', (req, res) => {
  const { table } = req.params
  res.render(`edit-${table}.njk`)
})

app.post('/:table/edit', multer.single('image'), (req, res, next) => {
  const { id } = req.query
  const dbTable = parseTable(req.params.table)
  Models[dbTable].findOneAndUpdate(id, req.body, { upsert: true })
    .then(data => {
      res.render('message.njk', { message: `${dbTable} saved successfully` })
    }
         )
    .catch(error => res.render('message.njk', {message: `an error occurred: ${error}` }))
})

app.get('/:table/delete', (req, res) => {
  const { id } = req.query
  const dbTable = parseTable(req.params.table)
  Models[dbTable].delete({_id: id})
    .then(deleted => {
          console.log('deleted: ', deleted)
          res.render('message.njk', { message: `Successfully deleted: ${deleted}` })
    })
    .catch(error => res.render('message.njk', {message: `an error occurred: ${error}`}))
})

app.get('/', (req, res) => {
  res.render('index.njk')
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

