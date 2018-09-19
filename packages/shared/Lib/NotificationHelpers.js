export const ActivityTypes = {
  like: 'ActivityStoryLike',
  follow: 'ActivityFollow',
  comment: 'ActivityStoryComment',
  guideLike: 'ActivityGuideLike',
  guideComment: 'ActivityGuideComment',
}

export function isActivityIncomplete(activity) {
  return !activity.fromUser
    || (activity.kind === ActivityTypes.like && !activity.story)
    || (activity.kind === ActivityTypes.follow && !activity.user)
    || (activity.kind === ActivityTypes.comment && !activity.story)
    || (activity.kind === ActivityTypes.guideLike && !activity.guide)
    || (activity.kind === ActivityTypes.guideComment && !activity.guide)
}

export function getDescription(activity) {
  switch (activity.kind) {
    case ActivityTypes.follow:
      return `is now following you.`
    case ActivityTypes.comment:
      return  `commented on your story ${activity.story.title}.`
    case ActivityTypes.guideComment:
      return  `commented on your guide ${activity.guide.title}.`
    case ActivityTypes.like:
      return `liked your story ${activity.story.title}.`
    case ActivityTypes.guideLike:
      return `liked your guide ${activity.guide.title}.`
  }
}

export function getPopulatedActivity(activityId, props) {
    const {users, stories, activities, guides} = props
    const activity = {...activities[activityId]}
    activity.user = users[activity.fromUser]
    if (activity.story) activity.story = stories[activity.story]
    if (activity.guide) activity.guide = guides[activity.guide]
    return activity
}
