import StandardError from 'standard-error'
import _ from 'lodash'

function CoreError(message, options) {
  if (!_.isObject(options)) {
    options = {};
  }

  // using defaults, but dont want to modify the original object
  options = _.defaults(_.clone(options), {
    statusCode: 400
  })

  StandardError.call(this, message, options)
}

CoreError.prototype = Object.create(StandardError.prototype, {
  constructor: {
    value: CoreError,
    writable: true,
    configurable: true
  }
})

export default CoreError