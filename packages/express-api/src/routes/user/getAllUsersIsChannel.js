import {User} from '@hero/ht-core'

export default function getAllUsersIsChannel(req, res) {
    return User.find({isChannel: true})
}