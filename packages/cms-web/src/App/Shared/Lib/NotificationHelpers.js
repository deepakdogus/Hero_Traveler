import _ from 'lodash'
import getImageUrl from './getImageUrl'

export const ActivityTypes = {
  like: 'ActivityStoryLike',
  follow: 'ActivityFollow',
  comment: 'ActivityStoryComment',
  guideLike: 'ActivityGuideLike',
  guideComment: 'ActivityGuideComment',
}

export const getAvatar = activity => _.get(activity, 'fromUser.profile.avatar')

export const getUsername = activity => _.get(activity, 'fromUser.username')

export const getUserId = activity => _.get(activity, 'fromUser.id')

export const isActivityIncomplete = activity =>
  !activity.fromUser
  || (activity.kind === ActivityTypes.like && !activity.story)
  || (activity.kind === ActivityTypes.follow && !activity.user)
  || (activity.kind === ActivityTypes.comment && !activity.story)
  || (activity.kind === ActivityTypes.guideLike && !activity.guide)
  || (activity.kind === ActivityTypes.guideComment && !activity.guide)

export const getFeedItemTitle = activity =>
  _.get(activity, 'story.title')
  || _.get(activity, 'guide.title', '')

export const getDescriptionText = activity => {
  switch (activity.kind) {
    case ActivityTypes.follow:
      return `is now following you`
    case ActivityTypes.comment:
      return `commented on your story `
    case ActivityTypes.guideComment:
      return `commented on your guide `
    case ActivityTypes.like:
      return `liked your story `
    case ActivityTypes.guideLike:
      return `liked your guide `
    default:
      return ''
  }
}

export const getDescription = activity =>
  `${getDescriptionText(activity)} ${getFeedItemTitle(activity)}.`

export const getPopulatedActivity = (activityId, props) => {
  const {users, stories, activities, guides} = props
  const activity = {...activities[activityId]}
  activity.fromUser = users[activity.fromUser]
  if (activity.story) activity.story = stories[activity.story]
  if (activity.guide) activity.guide = guides[activity.guide]
  if (activity.kind === ActivityTypes.comment) {
    if (activity.comment.story) activity.story = stories[activity.comment.story]
    if (activity.comment.guide) activity.guide = guides[activity.comment.guide]
  }
  return activity
}

export const getContent = activity => {
  switch (activity.kind) {
    case ActivityTypes.comment:
    case ActivityTypes.guideComment:
      return _.truncate(activity.comment.content, {length: 60})
    default:
      return ''
  }
}

export const getFeedItemImageUrl = (activity, videoThumbnailOptions) => {
  let imageUrl
  if (activity.kind === ActivityTypes.follow) return

  const feedItem = activity.story || activity.guide
  if (feedItem.coverImage) imageUrl = getImageUrl(feedItem.coverImage, 'thumbnail')
  else imageUrl = getImageUrl(feedItem.coverVideo, 'optimized', videoThumbnailOptions)

  return imageUrl
}

export const getHasVideo = activity =>
  !!_.get(activity, 'story.coverVideo')
  || !!_.get(activity, 'guide.coverVideo', '')
