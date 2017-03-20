import mongoose from 'mongoose'
import Promise from 'bluebird'
import seedDB from './seed'
import * as User from './user'
import * as Models from './models'
import * as Story from './story'

mongoose.Promise = Promise

export {User, Story, Models}

function startMongoDB(options) {
  mongoose.connect(options.mongoDB)

  if (options.seedDB && process.env.NODE_ENV === 'development'){
    try {
      seedDB()
    } catch (err) {
      console.log(err)
    }
  }
}

export default function initializeCore(options) {
  return Promise.all([
    startMongoDB(options)
  ])
}
