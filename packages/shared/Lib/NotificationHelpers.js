export const ActivityTypes = {
  like: 'ActivityStoryLike',
  follow: 'ActivityFollow',
  comment: 'ActivityStoryComment',
  guideLike: 'ActivityGuideLike',
  guideComment: 'ActivityGuideComment',
}

export function getIsActivityIncomplete(activity) {
  return !activity.fromUser
    || (activity.kind === ActivityTypes.like && !activity.story)
    || (activity.kind === ActivityTypes.follow && !activity.user)
    || (activity.kind === ActivityTypes.comment && !activity.story)
    || (activity.kind === ActivityTypes.guideLike && !activity.guide)
    || (activity.kind === ActivityTypes.guideComment && !activity.guide)
}
