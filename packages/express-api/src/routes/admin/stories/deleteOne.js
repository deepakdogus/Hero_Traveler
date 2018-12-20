import {Story} from '@hero/ht-core'
import _ from 'lodash'

export default async function deleteStory(req) {
  const storyIdToUpdate = req.params.id

  const storyPromise = Story.get({_id: req.params.id})
  return storyPromise
  .then((story) => {
    story.isDeleted = true;

    return story.save().then(story => {
      return story;
    }).catch((err) => {
      if (err) {
        return Promise.reject(Error("Story could not be updated"));
      }
    });
  });
}
