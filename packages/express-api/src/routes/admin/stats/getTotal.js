import {Models} from '@hero/ht-core'
import Promise from 'bluebird'
import _ from 'lodash'

export default function getTotal(req, res) {
  return Promise.props({
    totalStories: Models.Story.count().exec(),
    totalGuides: Models.Guide.count().exec(),
    totalUsers: Models.User.count().exec(),
    totalFlaggedStories: Models.Story.count({ flagged: true }).exec(),
  }) 
}
