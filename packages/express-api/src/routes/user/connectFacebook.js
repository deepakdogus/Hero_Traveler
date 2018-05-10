import {User, Models} from '@hero/ht-core'

// FACEBOOK Connect
// Connect a FB account to an existing one
export default function connectFacebook(req, res) {
  const {fbid, email} = req.body;

  return new Promise((resolve, reject) => {
    let response = Models.User.findOne({$or: [
      {
        "accounts.kind":"facebook",
        "accounts.uid":fbid
      },
      {
        "email": email
      }
    ]}).then((response) => {
      console.log(response);
      if (response == null ) {
        req.user.connectFacebook(fbid)
        return resolve(req.user.save());
      } else if (response._id === req.user._id) {
        return reject(Error('This account is already connected to Facebook.' + response.username));
      } else {
        return reject(Error('This Facebook user is already connected to another account.'));
      }
    })
  })

}