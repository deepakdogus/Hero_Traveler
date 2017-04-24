var path = require('path')

const express = require('express')
var nunjucks = require('nunjucks')
const app = express()

const pathToTemplates = path.resolve(__dirname, 'templates')

nunjucks.configure(pathToTemplates, {
  autoescape: true,
  express: app
})

app.get('/', (req, res) => {
  res.render('hello.html')
})

app.listen(3000)
console.log('App listening on port 3000')
