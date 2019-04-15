import Promise from 'bluebird'

export default function endpointWrapper(originalFunction) {
  return function (req, res, next) {
    Promise.resolve(originalFunction(req, res, next))
      .then(output => {
        return res.json(output)
      })
      .catch(err => {
        return next(err)
      })
  }
}
