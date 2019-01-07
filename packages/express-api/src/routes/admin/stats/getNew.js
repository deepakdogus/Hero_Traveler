import {Models} from '@hero/ht-core'
import Promise from 'bluebird'
import moment from 'moment'
import _ from 'lodash'

export default function getTotal(req, res) {
  const dateFrom = req.query.dateFrom
  const dateTill = req.query.dateTill
  return Promise.props({
    totalStories: Models.Story.count({
      createdAt: {
        $gte: moment(dateFrom).startOf('day').toDate(),
        $lte: moment(dateTill).endOf('day').toDate(),
      }
    }).exec(),
    totalGuides: Models.Guide.count({
      createdAt: {
        $gte: moment(dateFrom).startOf('day').toDate(),
        $lte: moment(dateTill).endOf('day').toDate(),
      }
    }).exec(),
    totalUsers: Models.User.count({
      createdAt: {
        $gte: moment(dateFrom).startOf('day').toDate(),
        $lte: moment(dateTill).endOf('day').toDate(),
      }
    }).exec(),
  }) 
}
