import Models from '../models'
import generateUserSeedData from './data/userData'
import generateStorySeedDate from './data/storyData';

const {Story, User} = Models;

export default async function seedController(){

    try {
        await removeAllData();
    } catch(err){
        console.log("error removing data")
    }

    console.log("data removed")

    try{
        await seedAllData();
    } catch (err){
        console.log("error seeding data", err)
    }

    console.log("data seeded")
}

function removeAllData(){
    let promises = [
        User.remove({}),
        Story.remove({})
    ];
    return Promise.all(promises)
}

async function seedAllData(){
    try {
        let users = await createUsers()
        let stories = await createStories(users);
    } catch (err){
        console.log("ERROR: seedAllData", err)
    }

}

function createUsers(){
    let userData = generateUserSeedData();
    return Promise.all(userData.map( user => User.create(user)))
}

function createStories(users){
    let storyData = generateStorySeedDate(users);
    return Promise.all(storyData.map( story => Story.create(story)))
}