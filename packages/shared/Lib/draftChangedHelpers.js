import _ from 'lodash'

//we need two arrays, because we don't have all the fields yet for web
const fieldsToCheck = [
  'categories',
  'coverCaption',
  'coverImage',
  'coverVideo',
  'description',
  'draftjsContent',
  'hashtags',
  'location',
  'title',
  'travelTips',
  'tripDate',
  'type',
  'slideshow',
  'actionButton',
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
  if (field === 'draftjsContent')
    return isDraftJSContentSame(workingDraft, comparisonDraft)
  return isEqual(workingDraft[field], comparisonDraft[field])
}

const isDraftJSContentSame = (workingDraft, comparisonDraft) => {
  const path = 'draftjsContent.blocks'
  const workingContent = _.merge({}, _.get(workingDraft, path))
  const comparisonContent = _.merge({}, _.get(comparisonDraft, path))

  const workingLen = Object.keys(workingContent).length
  const comparisonLen = Object.keys(comparisonContent).length
  const isNewUntouchedContent = workingLen === 1
    && comparisonLen === 0
    && workingContent[0].type === 'unstyled'
    && workingContent[0].text === ''

  if (isNewUntouchedContent) return true
  if (workingLen !== comparisonLen) return false

  return Object.keys(workingContent).every(key => {
    const workingBlock = workingContent[key]
    const comparisonBlock = comparisonContent[key]
    const baseCheck = workingBlock.key === comparisonBlock.key
      && workingBlock.type === comparisonBlock.type
    if (!baseCheck) return false
    if (workingBlock.type === 'atomic') {
      return _.isEqual(workingBlock, comparisonBlock)
    }
    return workingBlock.text === comparisonBlock.text
    && _.isEqual(workingBlock.inlineStyleRanges, comparisonBlock.inlineStyleRanges)
  })
}

const haveFieldsChanged = (workingDraft, comparisonDraft) => {
  if (!workingDraft || !comparisonDraft || _.isEqual(comparisonDraft, {})) return
  return !_.every(
    fieldsToCheck.map(field => isFieldSame(field, workingDraft, comparisonDraft))
  )
}

const hasChangedSinceSave = (workingDraft, draftToBeSaved) => {
  return !draftToBeSaved
    || (draftToBeSaved && haveFieldsChanged(workingDraft, draftToBeSaved))
}


export {
  isFieldSame,
  haveFieldsChanged,
  hasChangedSinceSave,
}
