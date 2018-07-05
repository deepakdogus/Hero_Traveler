import _ from 'lodash'
import {Models, Story, User} from '@hero/ht-core'
import {Constants, algoliaHelper} from '@hero/ht-util'
import deleteStory from '../story/deleteStory'

// Soft delete a user
export default function deleteUser(req, res) {
  const userIdToDelete = req.params.id
  const userId = req.user._id
  const isAdmin = Constants.USER_ROLES_ADMIN_VALUE === req.user.role

  let userPromise = Promise.resolve(req.user)

  console.log("Chechking user", userIdToDelete, userId)

  if (!userId.equals(userIdToDelete)) {
    if (!isAdmin) {
      console.log("Admin error")
      // Only admins can modify other users
      return Promise.reject(new Error('Unauthorized'))
    }
    userPromise = Models.User.findOne({_id: req.params.id})
  }

  console.log("Deleting user")

  return userPromise.then((user) => {
    console.log("Got user", user)
    // Step 1: Delete all the stories
    return Story.getUserStories(user.id).then(stories => {
      console.log("Got user stories", stories.length)
      return Promise.all(
        _.map(stories, (story) => {
          return deleteStory(story)
        })
      ).then(() => {
        return deleteAllHelper([
          // Step 2: Delete all the activities
          {
            model: Models.Activity, 
            query: {
              $or: [
                {fromUser: user.id},
                {user: user.id},
              ]
            }
          },
          // Step 3: Delete all the comments
          {
            model: Models.Comment, 
            query: {
              user: user.id
            }
          },
          // Step 4: Delete all the followers
          {
            model: Models.Follower, 
            query: {
              $or: [
                {follower: user.id},
                {followee: user.id},
              ]
            }
          },
        ]).then(() => {
          console.log("Deleting user")
          // Step 5: Delete the user!
          return User.deleteUser(user.id)
        })
      })
    })
  })
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
      return entity.delete()
    })
  )
}
