var path = require('path')

const express = require('express')
var nunjucks = require('nunjucks')
const app = express()

const pathToTemplates = path.resolve(__dirname, 'templates/')

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

nunjucks.configure(pathToTemplates, {
  autoescape: true,
  express: app,
  watch: true,
  cache: false
})

app.get('/users', (req, res) => {
  res.render('users.njk')
})

app.get('/', (req, res) => {
  res.render('index.njk', userData)
})

app.listen(3000, (req, res) => console.log('App listening on port 3000'))
