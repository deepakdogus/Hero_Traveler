import _ from 'lodash'

export default function getMimeType(filepath: string) {
  const ext = filepath.split('.').pop().toLowerCase()
  if (_.includes(ext, 'jpg') || _.includes(ext, 'jpg')) {
    return 'image/jpeg'
  }
 else if (_.includes(ext, 'png')) {
    return 'image/png'
  }
 else if (_.includes(ext, 'gif')) {
    return 'image/gif'
  }
 else if (_.includes(ext, 'avi')) {
    return 'video/avi'
  }
 else if (_.includes(ext, 'm1v')) {
    return 'video/mpeg'
  }
 else if (_.includes(ext, 'm2v')) {
    return 'video/mpeg'
  }
 else if (_.includes(ext, 'mov')) {
    return 'video/quicktime'
  }
 else if (_.includes(ext, 'moov')) {
    return 'video/quicktime'
  }
 else if (_.includes(ext, 'mp2')) {
    return 'video/mpeg'
  }
}
