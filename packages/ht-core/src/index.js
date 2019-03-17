import mongoose from 'mongoose'
import Promise from 'bluebird'
import * as User from './user'
import * as Models from './models'
import * as Story from './story'
import * as StoryDraft from './storyDraft'
import * as Postcard from './postcard'
import * as Category from './category'
import * as Hashtag from './hashtag'
import * as Comment from './comment'
import * as Guide from './guide'

mongoose.Promise = Promise


export {
  User,
  Story,
  StoryDraft,
  Postcard,
  Category,
  Hashtag,
  Models,
  Comment,
  Guide,
}

function startMongoDB(options) {
  return mongoose.connect(options.mongoDB)
}

export default function initializeCore(options) {
  return Promise.all([
    startMongoDB(options)
  ])
}
