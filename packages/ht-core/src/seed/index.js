import * as Models from '../models'
import {create as createUser} from '../user'
import {followUser} from '../user'
import {create as createStory} from '../story'
import {create as createCategory} from '../category'
import generateUserSeedData from './data/userData'
import generateStorySeedData from './data/storyData'
import generateCategorySeedData from './data/categoryData'
import generateFollowerSeedData from './data/followerData'

export default async function seedController() {

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

function removeAllData() {
  let promises = [
    Models.User.remove({}),
    Models.Story.remove({}),
    Models.AuthToken.remove({}),
    Models.Category.remove({}),
    Models.Follower.remove({}),
  ]

  return Promise.all(promises)
}

async function seedAllData() {
  try {
    let users = await createUsers()
    let followers = await createFollowers(users)
    let categories = await createCategories()
    let stories = await createStories(users, categories)
  } catch (err) {
    console.log("ERROR: seedAllData", err)
  }
}

function createUsers() {
  let userData = generateUserSeedData()
  return Promise.all(userData.map(createUser))
}

function createStories(users) {
  let storyData = generateStorySeedData(users)
  return Promise.all(storyData.map(createStory))
}

function createCategories() {
  let categoryData = generateCategorySeedData()
  return Promise.all(categoryData.map(createCategory))
}

function createFollowers(users) {
  let followerData = generateFollowerSeedData(users)
  return Promise.all(followerData.map(({follower, followee}) => {
    return followUser(follower, followee)
  }))
}
