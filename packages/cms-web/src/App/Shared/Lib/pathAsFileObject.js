import getMimeType from './getMimeType'

export default function pathAsFileObject(path: string): object {
  return {
    uri: path,
    name: path.split('/').pop(),
    type: getMimeType(path),
  }
}
