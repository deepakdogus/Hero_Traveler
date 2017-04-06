import mongoose from 'mongoose'
import Promise from 'bluebird'
import './models/plugins/meanie'
import * as User from './user'
import * as Models from './models'
import * as Story from './story'
import * as StoryDraft from './storyDraft'
import * as Category from './category'

mongoose.Promise = Promise

export {
  User,
  Story,
  StoryDraft,
  Category,
  Models,
}

function startMongoDB(options) {
  return mongoose.connect(options.mongoDB)
}

export default function initializeCore(options) {
  return Promise.all([
    startMongoDB(options)
  ])
}
