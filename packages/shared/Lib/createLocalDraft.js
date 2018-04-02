import uuid from 'uuid/v1'

export default function createLocalDraft(authorId){
  return {
    id: `local-${uuid()}`,
    author: authorId,
    categories: [],
    hashtags: [],
    counts: {
      comments: 0,
      bookmarks: 0,
      likes: 0,
    },
    draft: true,
    flagged: false,
  }
}
