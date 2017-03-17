import {Models} from 'ht-core'

/*

corresponds to 'Posts.getTopFiveGlobal' & 'Posts.userFeed' in the meteor repository
- gets top five posts
- and posts from people the user is following

 */

export default function getUserFeed(req, res) {
    let { id: userId } = req.query;
    Models.Story.find({}).populate('author').then(data => {
        res.json(data)
    })
}

