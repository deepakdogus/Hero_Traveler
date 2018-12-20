import {Story} from '@hero/ht-core'
import {Constants} from '@hero/ht-util'
import _ from 'lodash'


export default async function updateUser(req) {
  const attrs = Object.assign({}, req.body)
  const storyIdToUpdate = req.params.id
  
  const storyPromise = Story.get({_id: req.params.id})

  return storyPromise
  .then((story) => {

    for (let key in attrs) {
      story[key] = attrs[key]
    }

    return story.save();
  });
}
