import Promise from 'bluebird'
import debug from 'debug'

export default function endpointWrapper(originalFunction) {
  return function (req, res, next) {
    Promise.resolve(originalFunction(req, res, next))
      .then(output => {
        return res.json(output)
      })
      .catch(err => {
        debug('err', err)
        return next(err)
      })
  }
}
