import env from '../Config/Env'

const API_URI_BASE = `https://maps.googleapis.com/maps/api/place/details/json?key=${
  env.GOOGLE_API_KEY
}&placeid=`

const DEFAULT_FIELDS = `&fields=address_component,geometry,name`

export async function getPlaceDetail (placeId, placeByIdFields = DEFAULT_FIELDS) {
  try {
    const res = await fetch(`${API_URI_BASE}${placeId}${placeByIdFields}`)
    const data = await res.json()
    if (data.status !== 'OK') throw new Error(`Google Places API Error: ${data.status}`)
    return data.result
  }
  catch (err) {
    console.error(err)
  }
}
