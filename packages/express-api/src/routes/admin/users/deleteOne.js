import {User} from '@hero/ht-core'
import _ from 'lodash'

export default async function deleteUser(req) {
  const userIdToUpdate = req.params.id

  const userPromise = User.get({_id: req.params.id})
  return userPromise
  .then((user) => {
    user.isDeleted = true;

    return user.save().then(user => {
      return user;
    }).catch((err) => {
      if (err) {
        return Promise.reject(Error("User could not be updated"));
      }
    });
  });
}
