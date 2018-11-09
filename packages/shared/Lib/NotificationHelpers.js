import _ from 'lodash'

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

export function getFeedItemTitle(activity) {
  return _.get(activity, 'story.title') || _.get(activity, 'guide.title', '')
}

export function getDescriptionText(activity) {
  switch (activity.kind) {
    case ActivityTypes.follow:
      return `is now following you`
    case ActivityTypes.comment:
      return  `commented on your story `
    case ActivityTypes.guideComment:
      return  `commented on your guide `
    case ActivityTypes.like:
      return `liked your story `
    case ActivityTypes.guideLike:
      return `liked your guide `
    default:
      return ''
  }
}

export function getDescription(activity) {
  return getDescriptionText(activity) + getFeedItemTitle(activity) + '.'
}

export function getPopulatedActivity(activityId, props) {
  const {users, stories, activities, guides} = props
  const activity = {...activities[activityId]}
  activity.fromUser = users[activity.fromUser]
  if (activity.comment) {
    if (activity.comment.story) activity.story = stories[activity.comment.story]
    if (activity.comment.guide) activity.guide = guides[activity.comment.guide]
  }
  return activity
}

export function getContent(activity) {
  switch (activity.kind) {
    case ActivityTypes.comment:
    case ActivityTypes.guideComment:
      return _.truncate(activity.comment.content, {length: 60})
    default:
      return ''
  }
}
