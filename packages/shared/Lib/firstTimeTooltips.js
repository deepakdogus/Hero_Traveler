import _ from 'lodash'

export const Types = {
  MY_FEED: 'my_feed',
  STORY_CREATE: 'story_create',
  STORY_PHOTO_TAKE: 'story_photo_take',
  STORY_PHOTO_NEXT: 'story_photo_next',
  STORY_PHOTO_EDIT: 'story_photo_edit',
  PROFILE_NO_STORIES: 'profile_no_stories'
}

export default function isTooltipComplete(tooltipType: string, userTooltipInfo: object[]) {
  return _.some(userTooltipInfo, tooltipInfo => {
    const {name, seen} = tooltipInfo
    return tooltipType === name && seen
  })
}