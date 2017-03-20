import * as Models from '../models'
import {create as createUser} from '../user'
import {create as createStory} from '../story'
import generateUserSeedData from './data/userData'
import generateStorySeedData from './data/storyData'

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
  ]

  return Promise.all(promises)
}

async function seedAllData() {
  try {
    let users = await createUsers()
    let stories = await createStories(users)
  } catch (err) {
    console.log("ERROR: seedAllData", err)
  }
}

function createUsers() {
  let userData = generateUserSeedData()
  return Promise.all(userData.map( user => createUser(user)))
}

function createStories(users){
  let storyData = generateStorySeedData(users)
  return Promise.all(storyData.map( story => createStory(story)))
}
