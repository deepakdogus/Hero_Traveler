import {Models} from '@hero/ht-core'
import Promise from 'bluebird'
import _ from 'lodash'

export default function getTotal(req, res) {
  const dateFrom = _.without(req.query.dateFrom, '"')
  const dateTill = _.without(req.query.dateTill, '"')
  return Promise.props({
    totalStories: Models.Story.count({
      createdAt: {
        $gte: dateFrom,
        $lte: dateTill,
      }
    }).exec(),
    totalGuides: Models.Guide.count({
      createdAt: {
        $gte: dateFrom,
        $lte: dateTill,
      }
    }).exec(),
    totalUsers: Models.User.count({
      createdAt: {
        $gte: dateFrom,
        $lte: dateTill,
      }
    }).exec(),
  }) 
}
