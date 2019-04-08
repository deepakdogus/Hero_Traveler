import _ from 'lodash'
import getMimeType from './getMimeType'

export default function pathAsFileObject(path: string): object {
  const name = _.includes(path, '?')
    ? path.split('?')[0].split('/').pop()
    : path.split('/').pop()
  return {
    uri: path,
    name,
    type: getMimeType(path)
  }
}
