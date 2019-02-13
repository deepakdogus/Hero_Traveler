import {
  Activity,
  User,
  Comment,
  Follower,
} from '../models'
import {
  getUserStories, deleteStory
} from '../story'
import {
  getUserGuides, deleteGuide
} from '../guide'
import {algoliaHelper} from '@hero/ht-util'
import _ from 'lodash'

// Soft delete a user
export default function deleteUser(user) {
  // Step 1: Delete all the stories
  return getUserStories(user.id)
  .then(stories => {
    return Promise.all(
      _.map(stories, (story) => {
        return deleteStory(story.id)
      })
    )
  })
  .then(() => {
    return getUserGuides(user.id)
    .then(guides => {
      return Promise.all(
        _.map(guides, (guide) => {
          return deleteGuide(guide.id)
        })
      )
    })
  })
  .then(() => {
    return deleteAllHelper([
      // Step 2: Delete all the activities
      {
        model: Activity,
        query: {
          $or: [
            {fromUser: user.id},
            {user: user.id},
          ]
        }
      },
      // Step 3: Delete all the comments
      {
        model: Comment,
        query: {
          user: user.id
        }
      },
      // Step 4: Delete all the followers
      {
        model: Follower,
        query: {
          $or: [
            {follower: user.id},
            {followee: user.id},
          ]
        }
      },
    ])
  })
  .then(() => algoliaHelper.deleteUserFromIndex(user.id))
  .then(() => User.delete({_id: user.id}))
}

const deleteAllHelper = (modelsAndQueries) => {
  return Promise.all(_.map(modelsAndQueries, (modelAndQuery) => {
    return deleteAllFromModelHelper(
      modelAndQuery.model,
      modelAndQuery.query,
    )
  }))
}

const deleteAllFromModelHelper = (model, query) => {
  return model.find(query).then((entities) => {
    return deleteAllEntitiesHelper(entities)
  })
}

const deleteAllEntitiesHelper = (entities) => {
  return Promise.all(
    _.map(entities, (entity) => {
      return entity.remove()
    })
  )
}
