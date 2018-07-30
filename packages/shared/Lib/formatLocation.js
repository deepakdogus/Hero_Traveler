import _ from 'lodash'

export default function formatLocation(place) {
  return {
    name: place.name,
    locality: _.get(place, 'addressComponents.sublocality_level_1') || _.get(place, 'addressComponents.locality'),
    state: _.get(place, 'addressComponents.administrative_area_level_1'),
    country: _.get(place, 'addressComponents.country'),
    latitude: place.latitude,
    longitude: place.longitude,
  }
}
