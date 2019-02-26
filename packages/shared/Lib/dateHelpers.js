import moment from 'moment'

export function showTravelDate(feedItem) {
  return !!feedItem.tripDate && !!feedItem.publishedDate &&
    moment(feedItem.tripDate).format('DD-MM-YYYY') !==
    moment(feedItem.publishedDate).format('DD-MM-YYYY')
}

export function showPublishDate(feedItem) {
  return moment(feedItem.publishedDate || feedItem.createdAt).fromNow()
}

export function getTripDate(feedItem) {
  return showTravelDate(feedItem) ? moment(feedItem.tripDate).format('LL') : ''
}
