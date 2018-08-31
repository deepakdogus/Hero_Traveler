let config
if (process.env.NODE_ENV === 'development') {
  config = require('./dev')
} else {
  config = require('./prod')
}

export default config
