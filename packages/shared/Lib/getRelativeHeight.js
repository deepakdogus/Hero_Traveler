import _ from 'lodash'

export function extractCoverMetrics(cover) {
  if (_.get(cover, 'original.meta.coordinates.custom')) {
    return {
      height: _.get(cover, 'original.meta.coordinates.custom.0.3'),
      width: _.get(cover, 'original.meta.coordinates.custom.0.2'),
    }
  }
  return {
    height: _.get(cover, 'original.meta.height', cover.height),
    width: _.get(cover, 'original.meta.width', cover.width),
  }
}

export default function(targetWidth, coverMetrics){
  if (!targetWidth || !coverMetrics.width || !coverMetrics.height) return 0
  return targetWidth / coverMetrics.width * coverMetrics.height
}
