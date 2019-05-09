import User from '../models/user'
import getUser from './getUser'
import {
  getUserStories, restoreStory
} from '../story'
import {
  getUserGuides, restoreGuide
} from '../guide'
import {algoliaHelper} from '@hero/ht-util'
import _ from 'lodash'

// Soft delete a user
export default function restoreUser(userId) {
  // Step 1: Delete all the stories
  return getUserStories(userId)
  .then(stories => {
    return Promise.all(
      _.map(stories, (story) => {
        return restoreStory(story.id)
      })
    )
  })
  .then(() => {
    return getUserGuides(userId)
    .then(guides => {
      return Promise.all(
        _.map(guides, (guide) => {
          return restoreGuide(guide.id)
        })
      )
    })
  })
  .then(() => User.restore({_id: userId }))
  .then(() => getUser({_id: userId }))
  .then((user) => algoliaHelper.addUserToIndex(user).then(() => user))
}