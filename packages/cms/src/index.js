var dotenv = require('dotenv')
dotenv.config()
var bodyParser = require('body-parser')
var morgan = require('morgan')
var db = require('@rwoody/ht-core')

var initCore = db.default
const PORT = process.env.PORT || 3000
var path = require('path')


const express = require('express')
var nunjucks = require('nunjucks')
const app = express()


// Middleware
app.use(bodyParser.json({}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(morgan('dev'))

const pathToTemplates = path.resolve(__dirname, 'templates')

nunjucks.configure(pathToTemplates, {
  autoescape: true,
  express: app
})

app.get('/', (req, res) => {

var id = '58fe550e288aa759dbb8552f'

var result = db.User.find({_id: id })
    .then(function(result){
    	res.render(result)
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





