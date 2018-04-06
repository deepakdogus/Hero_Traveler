
export default {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 64,
  USERNAME_MIN_LENGTH: 5,
  USERNAME_MAX_LENGTH: 20,
  USERNAME_REGEX: /(?=^.{5,20}$)^[a-zA-Z][a-zA-Z0-9]*[._-]?[a-zA-Z0-9]+$/,
  EMAIL_REGEX: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,

  // Story types
  STORY_TYPE_SEE_LABEL: 'SEE',
  STORY_TYPE_SEE_VALUE: 'see',
  STORY_TYPE_EAT_LABEL: 'EAT',
  STORY_TYPE_EAT_VALUE: 'eat',
  STORY_TYPE_DO_LABEL: 'DO',
  STORY_TYPE_DO_VALUE: 'do',
  STORY_TYPE_STAY_LABEL: 'Stay',
  STORY_TYPE_STAY_VALUE: 'stay',

  // User roles
  USER_ROLES_USER_LABEL: 'User',
  USER_ROLES_ADMIN_LABEL: 'Admin',
  USER_ROLES_BRAND_LABEL: 'Brand',
  USER_ROLES_CONTRIBUTOR_LABEL: 'Contributor',
  USER_ROLES_FOUNDING_MEMBER_LABEL: 'Founding Member',
  USER_ROLES_USER_VALUE: 'user',
  USER_ROLES_ADMIN_VALUE: 'admin',
  USER_ROLES_BRAND_VALUE: 'brand',
  USER_ROLES_CONTRIBUTOR_VALUE: 'contributor',
  USER_ROLES_FOUNDING_MEMBER_VALUE: 'founding member',

  USER_NOTIFICATION_STORY_LIKE: 'story_like',
  USER_NOTIFICATION_STORY_COMMENT: 'story_comment',
  USER_NOTIFICATION_FOLLOWER: 'user_new_follower',

  DEVICE_TYPE_IOS: 'ios'
}
