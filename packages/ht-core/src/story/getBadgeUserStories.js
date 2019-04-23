import { Story, User } from '../models'

export default function getBadgeUserStories() {
  return User.getBadgeUsers().then(badgeUsers => Story.getStoriesByAuthors(badgeUsers))
}
