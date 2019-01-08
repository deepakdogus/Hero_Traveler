import _ from 'lodash'

//we need two arrays, because we don't have all the fields yet for web
const fieldsToCheck = [
  'title',
  'description',
  'coverCaption',
  'coverImage',
  'coverVideo',
  'tripDate',
  'location',
  'type',
  'categories',
  'hashtags',
  'travelTips',
]

const isEqual = (firstItem, secondItem) => {
  if (
    !!firstItem && !secondItem
    || !firstItem && !!secondItem
  ) {
    return false
  } else if (!!firstItem && !!secondItem) {
    // lodash will take of equality check for all objects
    return _.isEqual(firstItem, secondItem)
  } else {
    return true
  }
}

const isFieldSame = (field, workingDraft, comparisonDraft) => {
  // special check when comparing to draftToSave when nav to different route
  if (field === 'tripDate' && !workingDraft.tripDate) return true
  return isEqual(workingDraft[field], comparisonDraft[field])
}

const haveFieldsChanged = (workingDraft, comparisonDraft) => {
  if (!workingDraft || !comparisonDraft) return

  return !_.every(
    fieldsToCheck.map(field => isFieldSame(field, workingDraft, comparisonDraft))
  )
}


export {
  isFieldSame,
  haveFieldsChanged,
}
