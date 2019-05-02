import _ from 'lodash'

export default function formatLocation(place) {
  return {
    name: place.name,
    locality:
      _.get(place, 'addressComponents.sublocality_level_1') ||
      _.get(place, 'addressComponents.locality'),
    state: _.get(place, 'addressComponents.administrative_area_level_1'),
    country: _.get(place, 'addressComponents.country'),
    latitude: place.latitude,
    longitude: place.longitude
  }
}

export async function formatLocationWeb(
  description,
  placeId,
  geocodeByPlaceId,
  getLatLng
) {
  try {
    const geocode = await geocodeByPlaceId(placeId)
    const result = await extractWeb(geocode[0], getLatLng)
    return {
      name: description.split(',')[0],
      locality: result.sublocality_level_1 || result.locality,
      state: result.administrative_area_level_1,
      formattedAdress: geocode[0].formatted_address,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude
    }
  } catch (e) {
    console.error(e)
  }
}

async function extractWeb(place, getLatLng) {
  const addressComponents = {}
  place.address_components.forEach(component => {
    if (component.types) {
      component.types.forEach(type => {
        if (type !== 'political') addressComponents[type] = component.long_name
      })
    }
  })
  let latLng = await getLatLng(place)
  addressComponents.latitude = latLng.lat
  addressComponents.longitude = latLng.lng
  return addressComponents
}
