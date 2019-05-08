export default function isAdmin(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    return next()
  } else {
    res.statusCode = 403;

    return res.json({
      message: 'Unauthorized'
    });
  }    
}
