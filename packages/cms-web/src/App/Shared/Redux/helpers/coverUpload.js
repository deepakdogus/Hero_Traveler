import _ from 'lodash'

export function getNewCover(coverImage, coverVideo){
  if ((coverImage && coverImage.name) || (coverVideo && coverVideo.name)) {
    const cover = coverImage || coverVideo
    return {
      uri: cover.uri,
      name: cover.name,
      type: cover.type,
    }
  }
  return undefined
}

export function saveCover(api, workingDraft, cover){
  let promise
  if (workingDraft.coverImage) promise = api.uploadCoverImage(workingDraft.id, cover)
  else promise = api.uploadCoverVideo(workingDraft.id, cover)
  return promise.then(resp => {
    return _.merge(
      {}, workingDraft, {
      coverImage: resp.data.coverImage,
      coverVideo: resp.data.coverVideo,
    })
  })
}

export function changeCoverVideo(state, coverVideo){
  const nullVideo = state.setIn(
    ['workingDraft', 'coverVideo'],
    null,
  )
  return nullVideo.setIn(
    ['workingDraft', 'coverVideo'],
    coverVideo,
  )
}

export function needToChangeCoverVideo(state, workingDraft){
  return (
    (state.workingDraft.coverVideo && workingDraft.coverVideo)
      && (state.workingDraft.coverVideo.uri !== workingDraft.coverVideo.uri)
  )
}
