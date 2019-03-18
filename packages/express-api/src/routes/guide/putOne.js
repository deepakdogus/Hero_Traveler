import {Guide} from '@hero/ht-core'
import {Constants} from '@hero/ht-util'
import _ from 'lodash'


export default async function updateUser(req) {
  const attrs = Object.assign({}, req.body)
  attrs.id = req.params.id
  return Guide.updateGuide(attrs);
}
