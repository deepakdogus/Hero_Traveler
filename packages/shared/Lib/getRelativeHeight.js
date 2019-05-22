import _ from 'lodash'

export function extractCoverMetrics(cover){
  const height = _.get(cover, 'original.meta.coordinates.custom') ? 
    _.get(cover, 'original.meta.coordinates.custom.0.3') :
    _.get(cover, 'original.meta.height') || cover.height;
  const width = _.get(cover, 'original.meta.coordinates.custom') ? 
    _.get(cover, 'original.meta.coordinates.custom.0.2') :
    _.get(cover, 'original.meta.width') || cover.width;
  return {
    height,
    width,
  }
}

export default function(targetWidth, coverMetrics){
  if (!targetWidth || !coverMetrics.width || !coverMetrics.height) return 0
  return targetWidth / coverMetrics.width * coverMetrics.height
}
