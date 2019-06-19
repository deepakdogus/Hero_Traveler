import _ from 'lodash'

//refactored util function to increment/decrement Stories or Guides counts
export default function changeCountOfType (state, {feedItemId, countType, isIncrement}){
  const currentNumCountOfType = _.get(
    state,
    `entities.${feedItemId}.counts.${countType}`,
    0,
  )
  return state.setIn(
    ['entities', feedItemId, 'counts', countType],
    isIncrement ? currentNumCountOfType + 1 : currentNumCountOfType - 1
  )
}
