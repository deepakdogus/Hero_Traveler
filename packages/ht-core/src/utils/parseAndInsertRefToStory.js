import _ from 'lodash'

// Separate the new refs (text string) from the existing refs (_ids)
export default async function parseAndInsertRefToStory(refModel, refsArray, createMethod) {
  if (refsArray.length === 0) return refsArray
  // due to connectivity issues we can get IDless refs (category or hashtag)
  // that actually already exist. We are adding this check to avoid duplicates
  refsArray = await Promise.all(refsArray.map(ref => {
    if (ref._id) return Promise.resolve(ref)
    else return refModel.findOne(ref)
    .then(foundRef => foundRef || ref)
  }))

  const refsToCreate = refsArray.filter(ref => !ref._id)
  const existingRefs = refsArray.filter(ref => !!ref._id)
  const newRefs = await createMethod(refsToCreate)

  return existingRefs.concat(newRefs).map(ref => {
    return {_id: ref._id}
  })
}
