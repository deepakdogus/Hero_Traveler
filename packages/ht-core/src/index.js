import mongoose from 'mongoose'
import Promise from 'bluebird'
import seedDB from './seed'


mongoose.Promise = Promise
// @TODO extract to init function
if (process.env.NODE_ENV === 'development') {
  mongoose.connect('mongodb://localhost/ht-mono');
} else {
  mongoose.connect('mongodb://ht-api:lFMGJtlEO13MV5qd4GBa0wjkQLiteVq9n1pyQChp3aRgH@ds161008.mlab.com:61008/hero-traveler')
}

const seed = false;
if (seed){
    try {
        seedDB()
    } catch (err){
        console.log(err)
    }
}

export {default as User} from './user'
export {default as Models} from './models'
