import uuid from 'uuid/v1'

export default function createLocalGuideDraft(authorId, story){
  return {
    id: `local-${uuid()}`,
    title: undefined,
    description: undefined,
    author: authorId,
    categories: [],
    locations: [],
    flagged: undefined,
    counts: undefined,
    coverImage: undefined,
    isPrivate: undefined,
    cost: undefined,
    duration: undefined,
    stories: [story],
  }
}
