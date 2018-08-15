import _ from 'lodash'

//we need two arrays, because we don't have all the fields yet for web
const fieldsToCheckMobile = [
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
  'travelTips'
]

const fieldsToCheckWeb = [
  'title',
  'description',
  'coverCaption',
  'coverImage',
  'coverVideo',
  'tripDate',
  'location',
  'type',
  'categories'
]

const isEqual = (firstItem, secondItem) => {
  if (!!firstItem && !secondItem || !firstItem && !!secondItem) {
    return false
  } else if (!!firstItem && !!secondItem) {
    // lodash will take of equality check for all objects
    return _.isEqual(firstItem, secondItem)
  } else {
    return true
  }
}

const isFieldSame = (field, workingDraft, originalDraft) => {
  return isEqual(workingDraft[field], originalDraft[field])
}

const haveFieldsChanged = (workingDraft, originalDraft, platform) => {
  if(!workingDraft || !originalDraft) return
  const fields = platform === 'mobile'
  ? fieldsToCheckMobile
  : fieldsToCheckWeb

  return !_.every(
    fields.map(field => isFieldSame(field, workingDraft, originalDraft))
  )
}


export {
  isFieldSame,
  haveFieldsChanged,
}