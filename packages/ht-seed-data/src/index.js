import dotenv from 'dotenv'
dotenv.config()
import fs from 'fs'
import _ from 'lodash'
import Core, {
  User,
  Story,
  Category,
  Models
} from '@rwoody/ht-core'
import generateUserSeedData from './data/userData'
import generateStorySeedData from './data/storyData'
import generateCategorySeedData from './data/categoryData'
import generateFollowerSeedData from './data/followerData'

function removeAllData() {
  let promises = [
    Models.User.remove({}),
    Models.Category.remove({}),
    Models.AuthToken.remove({}),
    Models.Story.remove({}),
    Models.Follower.remove({}),
    Models.StoryBookmark.remove({}),
    Models.StoryLike.remove({}),
    Models.StoryDraft.remove({}),
    Models.Comments.remove({}),
  ]

  return Promise.all(promises)
}

async function seedAllData() {
  try {
    let users = await createUsers(50)
    let followers = await createFollowers(users, 1500)
    let categories = await createCategories()
    let stories = await createStories(users, categories, 100)
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
    console.log("error removing data")
  }

  console.log("data removed")

  try {
    await seedAllData()
  } catch (err) {
    console.log("error seeding data", err)
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
