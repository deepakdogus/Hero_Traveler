import _ from 'lodash'

const normalizeAddressComponents = address_components => {
  const addressComponents = {}
  address_components.forEach(component => {
    if (component.types) {
      component.types.forEach(type => {
        if (type !== 'political') addressComponents[type] = component.long_name
      })
    }
  })
  return addressComponents
}

async function extractWeb(place, getLatLng) {
  const addressComponents =  normalizeAddressComponents(place.address_components)
  let latLng = await getLatLng(place)
  addressComponents.latitude = latLng.lat
  addressComponents.longitude = latLng.lng
  return addressComponents
}

export default function formatLocation(place) {
  const addressComponents = normalizeAddressComponents(place.address_components)
  return {
    name: place.name,
    locality: addressComponents.locality || addressComponents.sublocality_level_1,
    state: addressComponents.administrative_area_level_1,
    country:addressComponents.country,
    latitude: _.get(place, 'geometry.location.lat'),
    longitude: _.get(place, 'geometry.location.lng')
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

