import mongoose from 'mongoose'
import Promise from 'bluebird'
import seedDB from './seed'


mongoose.Promise = Promise
// @TODO extract to init function
mongoose.connect('mongodb://localhost/ht-mono');

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
