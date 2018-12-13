import _ from 'lodash'

export const Types = {
  STORY_PHOTO_NEXT: 'story_photo_next',
  STORY_PHOTO_EDIT: 'story_photo_edit',
  PROFILE_NO_STORIES: 'profile_no_stories',
  STORY_CREATE_CATEGORIES: 'story_create_categories',
  STORY_CREATE_HASHTAGS: 'story_create_hashtags',
  ADD_TO_GUIDE: 'add_to_guide',
  GUIDE_IS_VERIFIED: 'guide_is_verified',
}

export default function isTooltipComplete(tooltipType: string, userTooltipInfo: object[]) {
  return _.some(userTooltipInfo, tooltipInfo => {
    const {name, seen} = tooltipInfo
    return tooltipType === name && seen
  })
}