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

export function saveCover(api, draftId, cover, isPhoto){
  if (isPhoto) return api.uploadCoverImage(draftId, cover)
  else return api.uploadCoverVideo(draftId, cover)
}
