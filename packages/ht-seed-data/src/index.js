import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs'
import _ from 'lodash'
import Core, {
  User,
  Story,
  Category,
  Hashtag,
  Models
} from '@hero/ht-core'
import generateUserSeedData from './data/userData'
import generateStorySeedData from './data/storyData'
import generateCategorySeedData from './data/categoryData'
import generateHashtagSeedData from './data/hashtagData'
import generateFollowerSeedData from './data/followerData'

function removeAllData() {
  let promises = [
    Models.Activity.remove({}),
    Models.User.remove({}),
    Models.Category.remove({}),
    Models.Hashtag.remove({}),
    Models.AuthToken.remove({}),
    Models.Story.remove({}),
    Models.Follower.remove({}),
    Models.StoryBookmark.remove({}),
    Models.StoryLike.remove({}),
    // Models.StoryDraft.remove({}),
    Models.Comment.remove({}),
  ]

  return Promise.all(promises)
}

async function seedAllData() {
  try {
    // let users = await createUsers(0)
    // let followers = await createFollowers(users, 0)

    // Only seeding categories and hashtags for now, as that's all that is needed
    // to run the app
    let categories = await createCategories()
    let hashtags = await createHashtags()

    // let stories = await createStories(users, categories, 100)
    return Promise.resolve()
  } catch (err) {
    console.log("ERROR: seedAllData", err)
    return Promise.reject()
  }
}

function createUsers(count) {
  let userData = generateUserSeedData(count)
  return Promise.all(userData.map(User.create))
}

async function createStories(users, categories, count) {
  let storyData = await generateStorySeedData(users, categories, count)
  return Promise.all(storyData.map(Story.create))
}

async function createCategories() {
  let categoryData = await generateCategorySeedData()
  return Promise.all(categoryData.map(Category.create))
}

async function createHashtags() {
  let hashtagData = await generateHashtagSeedData()
  return Promise.all(hashtagData.map(Hashtag.create))
}

async function createFollowers(users, count) {
  let followerData = await generateFollowerSeedData(users, count)
  return Promise.all(followerData.filter(r => {
    return r.follower !== r.followee
  }).map(({follower, followee}) => {
    return User.followUser(follower, followee)
  }))
}

async function seed() {
  try {
    await removeAllData()
  } catch(err) {
    console.log("error removing data", err)
  }

  console.log("data removed")

  try {
    await seedAllData()
  } catch (err) {
    console.log("error seeding data")
  }

  console.log("data seeded")
}

Core({
  mongoDB: process.env.MONGODB_URL
})
.then(() => {
  seed()
    .then(() => process.exit(0))
    .catch(e => {
      console.error(e)
      process.exit(1)
    })
})
