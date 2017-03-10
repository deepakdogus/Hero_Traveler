import mongoose from 'mongoose'
import Promise from 'bluebird'

mongoose.Promise = Promise

// @TODO extract to init function
mongoose.connect('mongodb://localhost/ht-mono');

export {default as Models} from './models'
