import 'babel-polyfill'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import initCore, {Models} from '@hero/ht-core'
import path from 'path'
import nunjucks from 'nunjucks'
import flash from 'connect-flash'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import favicon from 'serve-favicon'

const app = express()
const PORT = process.env.PORT || 3002

/* settings for template rendering */

const pathToTemplates = path.resolve(__dirname, 'templates/')
const resultsPerPage = 15
import multer from './multer'
import auth from './auth'
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
app.use('/authenticate', auth.authRouter)

// setting up favicon
const faviconPath = path.resolve(__dirname, './public/favicon.ico');
app.use(favicon(faviconPath))

nunjucks.configure(pathToTemplates, {
  autoescape: true,
  express: app,
  watch: process.env.NODE_ENV !== 'production',
  cache: process.env.NODE_ENV === 'production'
})

app.get('/logout', (req, res) => {
  res.clearCookie('user').status(200).redirect('/')
})

app.get('/:table', auth.isAuthenticated, (req, res) => {
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

app.get('/:table/edit', auth.isAuthenticated, (req, res) => {
  const { id } = req.query
  const dbTable = parseTable(req.params.table)
  Models[dbTable].findById(id)
  .then((data) => res.render(`edit-${req.params.table}.njk`, { data }))
})

app.get('/:table/create', auth.isAuthenticated, (req, res) => {
  const { table } = req.params
  res.render(`edit-${table}.njk`)
})

app.post('/:table/edit', auth.isAuthenticated, multer.single('image'), (req, res, next) => {
  const { id } = req.query
  const dbTable = parseTable(req.params.table)
  Models[dbTable].findByIdAndUpdate(id, req.body, { upsert: true })
  .then(data => {
    res.render('message.njk', { message: `${dbTable} saved successfully` })
  })
  .catch(error => res.render('message.njk', {message: `an error occurred: ${error}` }))
})

app.get('/:table/delete', auth.isAuthenticated, (req, res) => {
  const { id } = req.query
  const dbTable = parseTable(req.params.table)
  Models[dbTable].delete({_id: id})
  .then(deleted => res.render('message.njk', { message: `Successfully deleted: ${deleted}`}))
  .catch(error => res.render('message.njk', {message: `an error occurred: ${error}`}))
})

app.get('/', (req, res) => {
  console.log('req.cookie', req.cookies)
  const loggedIn = req.cookies.user ? req.cookies.user.username : false
  res.render('index.njk', { loggedIn } )
})

initCore({
  mongoDB: process.env.MONGODB_URL,
  seedDB: process.env.SEED_DB,
})
.then(() => {
  app.listen(PORT, err => {
    if (err) {
      console.error(err)
    } else {
      console.log(`App running on port ${PORT}`)
    }
  })
})
