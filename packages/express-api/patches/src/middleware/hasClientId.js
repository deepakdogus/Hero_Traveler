
// @TODO implement client ids
export default function hasClientId(req, res, next) {
  if (!req.headers['client-id']) {
    return next(new Error('Unauthorized'))
  }

  return next()
}
