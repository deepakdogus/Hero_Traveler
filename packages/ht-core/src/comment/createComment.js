import {Comment} from '../models'

export default function createComment(attrs) {
  return Comment.create(attrs)
}