import {User} from '@hero/ht-core'

export default function getMe(req, res) {
  const userId = req.user._id
  User.get({_id: userId}).then((user) => {
    if (user.role !== 'admin') {
      res.statusCode = 403;

      return res.json({
        message: 'Only admins are allowed'
      });
    } else {
      return res.json(user);
    }
  }).catch((err) => { throw new Error(err) })
}
