import _ from 'lodash'

export const Types = {
  STORY_CREATE: 'story_create',
  STORY_PHOTO_TAKE: 'story_photo_take',
  STORY_PHOTO_NEXT: 'story_photo_next',
  STORY_PHOTO_EDIT: 'story_photo_edit',
  PROFILE_NO_STORIES: 'profile_no_stories',
  STORY_CREATE_CATEGORIES: 'story_create_categories',
}

export default function isTooltipComplete(tooltipType: string, userTooltipInfo: object[]) {
  return _.some(userTooltipInfo, tooltipInfo => {
    const {name, seen} = tooltipInfo
    return tooltipType === name && seen
  })
}
